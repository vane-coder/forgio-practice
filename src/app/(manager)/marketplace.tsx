import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getListings, buyFromMarketplace, createListing } from "../../services/marketplace.service";
import { getMaterials } from "../../services/materials.service";

const categories = ["ALL", "FABRIC", "CHEMICAL", "PACKAGING"];

export default function MarketplaceScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [buyModal, setBuyModal] = useState<any>(null);
  const [buyQty, setBuyQty] = useState("1");
  const [buying, setBuying] = useState(false);

  const [sellModal, setSellModal] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [sellMaterialId, setSellMaterialId] = useState("");
  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [selling, setSelling] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const [listData, matData] = await Promise.all([
            getListings(token).catch(() => []),
            getMaterials(token).catch(() => []),
          ]);
          setListings(Array.isArray(listData) ? listData : []);
          setMaterials(Array.isArray(matData) ? matData : []);
        }
      } catch (e) { console.log("marketplace load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = listings.filter((l) =>
    (category === "ALL" || l.category === category) &&
    (l.materialName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleBuy = async () => {
    if (!buyModal) return;
    const qty = parseInt(buyQty, 10);
    if (!qty || qty < 1) { Alert.alert("Invalid", "Enter a valid quantity."); return; }
    setBuying(true);
    try {
      const token = await getToken();
      if (token) {
        await buyFromMarketplace(token, { listingId: buyModal.listingId, quantity: qty });
        setListings((prev) => prev.filter((l) => l.listingId !== buyModal.listingId));
        Alert.alert("Purchased", "Order placed successfully.");
        setBuyModal(null);
      }
    } catch { Alert.alert("Error", "Purchase failed."); }
    finally { setBuying(false); }
  };

  const handleSell = async () => {
    if (!sellMaterialId || !sellQty || !sellPrice) { Alert.alert("Missing", "Fill in all fields."); return; }
    setSelling(true);
    try {
      const token = await getToken();
      if (token) {
        const result = await createListing(token, {
          materialId: sellMaterialId,
          quantity: parseFloat(sellQty),
          pricePerUnit: parseFloat(sellPrice),
        });
        setListings((prev) => [result, ...prev]);
        Alert.alert("Listed", "Material listed on marketplace.");
        setSellModal(false); setSellMaterialId(""); setSellQty(""); setSellPrice("");
      }
    } catch { Alert.alert("Error", "Failed to create listing."); }
    finally { setSelling(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Marketplace</Text>
                <Text style={styles.headerSub}>Buy materials from other factories</Text>
              </View>
              <TouchableOpacity style={styles.sellBtn} onPress={() => setSellModal(true)}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.sellBtnText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#888" />
              <TextInput style={styles.searchInput} placeholder="Search materials..." placeholderTextColor="#aaa" value={search} onChangeText={setSearch} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.categoryRow}>
                {categories.map((c) => (
                  <TouchableOpacity key={c} style={[styles.categoryTab, category === c && styles.categoryTabActive]} onPress={() => setCategory(c)}>
                    <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>
                      {c === "ALL" ? "All" : c.charAt(0) + c.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {loading && <View style={styles.emptyState}><ActivityIndicator size="large" color="#1565C0" /></View>}

            {!loading && filtered.map((item) => (
              <View key={item.listingId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.materialIcon}><Ionicons name="cube-outline" size={20} color="#1565C0" /></View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.materialName}>{item.materialName}</Text>
                    <Text style={styles.sellerName}>{item.sellerFactoryName || "Factory"}</Text>
                  </View>
                  <View>
                    <Text style={styles.price}>GHS {item.pricePerUnit}</Text>
                    <Text style={styles.available}>{item.quantity} available</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardFooter}>
                  <View style={styles.locationRow}>
                    <Ionicons name="pricetag-outline" size={12} color="#888" />
                    <Text style={styles.locationText}>{item.category || "Material"}</Text>
                  </View>
                  <TouchableOpacity style={styles.buyBtn} onPress={() => { setBuyModal(item); setBuyQty("1"); }}>
                    <Text style={styles.buyBtnText}>Buy now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {!loading && filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={40} color="#ccc" />
                <Text style={styles.emptyText}>No materials listed yet</Text>
              </View>
            )}

            <View style={styles.sellCard}>
              <View style={styles.sellCardLeft}>
                <Text style={styles.sellCardTitle}>Have surplus materials?</Text>
                <Text style={styles.sellCardSub}>List them on the marketplace and sell to other factories.</Text>
              </View>
              <TouchableOpacity style={styles.listBtn} onPress={() => setSellModal(true)}>
                <Text style={styles.listBtnText}>List now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Buy modal */}
        <Modal visible={!!buyModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Buy {buyModal?.materialName}</Text>
              <Text style={styles.modalSub}>GHS {buyModal?.pricePerUnit} per unit · {buyModal?.quantity} available</Text>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={buyQty} onChangeText={setBuyQty} keyboardType="numeric" placeholder="1" placeholderTextColor="#aaa" />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleBuy} disabled={buying}>
                {buying ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Confirm purchase</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setBuyModal(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Sell modal */}
        <Modal visible={sellModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>List material for sale</Text>
              <Text style={styles.label}>Material</Text>
              <ScrollView style={{ maxHeight: 120, marginBottom: 12 }}>
                {materials.map((m) => (
                  <TouchableOpacity key={m.materialId} style={[styles.matOption, sellMaterialId === m.materialId && styles.matOptionActive]} onPress={() => setSellMaterialId(m.materialId)}>
                    <Text style={[styles.matOptionText, sellMaterialId === m.materialId && { color: "#fff" }]}>{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={sellQty} onChangeText={setSellQty} keyboardType="numeric" placeholder="e.g. 50" placeholderTextColor="#aaa" />
              <Text style={styles.label}>Price per unit (GHS)</Text>
              <TextInput style={styles.input} value={sellPrice} onChangeText={setSellPrice} keyboardType="numeric" placeholder="e.g. 12.50" placeholderTextColor="#aaa" />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleSell} disabled={selling}>
                {selling ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>List now</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSellModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  sellBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  sellBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  body: { padding: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13, color: "#1A1A1A" },
  categoryRow: { flexDirection: "row", gap: 8 },
  categoryTab: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0" },
  categoryTabActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  categoryText: { fontSize: 12, color: "#888" },
  categoryTextActive: { color: "#fff", fontWeight: "500" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  materialIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1 },
  materialName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  sellerName: { fontSize: 11, color: "#888", marginTop: 2 },
  price: { fontSize: 13, fontWeight: "500", color: "#1565C0", textAlign: "right" },
  available: { fontSize: 10, color: "#888", textAlign: "right", marginTop: 2 },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 11, color: "#888" },
  buyBtn: { backgroundColor: "#1565C0", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  buyBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: "#888" },
  sellCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#E3F2FD", borderRadius: 12, padding: 14, marginTop: 6, marginBottom: 24, gap: 12 },
  sellCardLeft: { flex: 1 },
  sellCardTitle: { fontSize: 13, fontWeight: "500", color: "#0C447C" },
  sellCardSub: { fontSize: 11, color: "#1565C0", marginTop: 3, lineHeight: 16 },
  listBtn: { backgroundColor: "#1565C0", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  listBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 4 },
  modalSub: { fontSize: 12, color: "#888", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  input: { backgroundColor: "#F5F7FA", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 14, color: "#1A1A1A", marginBottom: 16 },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  confirmBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center" },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
  matOption: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4, backgroundColor: "#F5F7FA" },
  matOptionActive: { backgroundColor: "#1565C0" },
  matOptionText: { fontSize: 13, color: "#1A1A1A" },
});