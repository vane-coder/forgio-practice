import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect} from "expo-router";
import { getToken } from "../../auth";
import { getListings } from "../../services/marketplace.service";
import { colors } from "../../constants/Colors";

const categories = ["ALL", "FABRIC", "CHEMICAL", "PACKAGING"];

export default function WorkerMarketplaceScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getListings(token).catch(() => []);
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("marketplace load failed", e); }
      finally { setLoading(false); }
    })();
  }, []));

  const filtered = listings.filter((l) =>
    (category === "ALL" || l.category === category) &&
    (l.materialName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Marketplace</Text>
            <Text style={styles.headerSub}>Available goods from other factories</Text>
          </View>

          <View style={styles.body}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color={colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search materials..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} />
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

            <View style={styles.readOnlyBanner}>
              <Ionicons name="eye-outline" size={14} color={colors.primary} />
              <Text style={styles.readOnlyText}>View only — contact your manager to buy or sell.</Text>
            </View>

            {loading && <View style={styles.emptyState}><ActivityIndicator size="large" color={colors.primary} /></View>}

            {!loading && filtered.map((item) => (
              <View key={item.listingId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.materialIcon}><Ionicons name="cube-outline" size={20} color={colors.primary} /></View>
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
                    <Ionicons name="pricetag-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.locationText}>{item.category || "Material"}</Text>
                  </View>
                </View>
              </View>
            ))}

            {!loading && filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={40} color={colors.border} />
                <Text style={styles.emptyText}>No materials listed yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 13, color: colors.textDark },
  categoryRow: { flexDirection: "row", gap: 8 },
  categoryTab: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  categoryTabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  categoryText: { fontSize: 12, color: colors.textMuted },
  categoryTextActive: { color: colors.white, fontWeight: "500" },
  readOnlyBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.blueTint, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  readOnlyText: { fontSize: 11, color: colors.primary, flex: 1 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  materialIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1 },
  materialName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  sellerName: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 13, fontWeight: "500", color: colors.primary, textAlign: "right" },
  available: { fontSize: 10, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  divider: { height: 0.5, backgroundColor: colors.border, marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 11, color: colors.textMuted },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
