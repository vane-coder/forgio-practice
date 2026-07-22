import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getListings } from "../../services/marketplace.service";

const categories = ["ALL", "FABRIC", "CHEMICAL", "PACKAGING"];

export default function MarketplaceScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getListings(token);
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.log("Failed to load listings", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = listings.filter((l) =>
    (category === "ALL" || l.category === category) &&
    (l.materialName || "").toLowerCase().includes(search.toLowerCase())
  );

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
              <TouchableOpacity
                style={styles.sellBtn}
                onPress={() => router.push("/(manager)/shipments")}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.sellBtnText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {/* Search */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search materials..."
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Category filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.categoryRow}>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.categoryTab, category === c && styles.categoryTabActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.categoryText, category === c && styles.categoryTextActive]}>
                      {c === "ALL" ? "All" : c.charAt(0) + c.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Loading */}
            {loading && (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#1565C0" />
                <Text style={styles.emptyText}>Loading listings...</Text>
              </View>
            )}

            {/* Listings */}
            {!loading && filtered.map((item) => (
              <View key={item.listingId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.materialIcon}>
                    <Ionicons name="cube-outline" size={20} color="#1565C0" />
                  </View>
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
                  <TouchableOpacity style={styles.buyBtn}>
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

            {/* Sell your materials */}
            <View style={styles.sellCard}>
              <View style={styles.sellCardLeft}>
                <Text style={styles.sellCardTitle}>Have surplus materials?</Text>
                <Text style={styles.sellCardSub}>List them on the marketplace and sell to other factories.</Text>
              </View>
              <TouchableOpacity style={styles.listBtn}>
                <Text style={styles.listBtnText}>List now</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
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
});