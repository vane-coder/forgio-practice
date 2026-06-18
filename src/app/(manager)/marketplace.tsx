import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const initialListings = [
  {
    id: "1",
    name: "Cotton Fabric",
    seller: "Accra Textiles Ltd",
    price: "GHS 12/kg",
    available: "500kg avail.",
  },
  {
    id: "2",
    name: "Dye Chemical",
    seller: "Kumasi Chem Co.",
    price: "GHS 45/L",
    available: "120L avail.",
  },
];

export default function MarketplaceScreen() {
  const [search, setSearch] = useState("");

  const filtered = initialListings.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Buy materials from other factories</Text>
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search materials..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Listings */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.seller}>Seller: {item.seller}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.available}>{item.available}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => Alert.alert("Purchase", `Buying ${item.name}`)}
            >
              <Text style={styles.buyButtonText}>Buy now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#1a237e", padding: 20, paddingTop: 50 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "#90caf9", fontSize: 13 },
  search: {
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: "flex-end" },
  itemName: { fontWeight: "bold", fontSize: 16, color: "#000" },
  seller: { color: "#888", fontSize: 13, marginTop: 4 },
  price: { color: "#1565c0", fontWeight: "bold", fontSize: 15 },
  available: { color: "#1565c0", fontSize: 13, marginTop: 4 },
  buyButton: {
    backgroundColor: "#1565c0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
  