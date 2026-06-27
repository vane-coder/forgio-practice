import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Modal
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const materials = [
  { id: 1, name: "Cotton Fabric", unit: "kg", stock: 48, reorder: 100, cost: 12, status: "LOW" },
  { id: 2, name: "Polyester Thread", unit: "kg", stock: 320, reorder: 50, cost: 8, status: "OK" },
  { id: 3, name: "Dye Chemical", unit: "L", stock: 87, reorder: 100, cost: 45, status: "WATCH" },
  { id: 4, name: "Packaging Boxes", unit: "units", stock: 600, reorder: 200, cost: 2, status: "OK" },
  { id: 5, name: "Buttons", unit: "units", stock: 1200, reorder: 500, cost: 0.5, status: "OK" },
];

const getStatusStyle = (status: string) => {
  if (status === "LOW") return { bg: "#FFEBEE", color: "#C62828", label: "Low" };
  if (status === "WATCH") return { bg: "#FFF3E0", color: "#E65100", label: "Watch" };
  return { bg: "#E8F5E9", color: "#2E7D32", label: "OK" };
};

const getProgressWidth = (stock: number, reorder: number) => {
  const pct = Math.min((stock / (reorder * 2)) * 100, 100);
  return `${pct}%`;
};

const getProgressColor = (status: string) => {
  if (status === "LOW") return "#C62828";
  if (status === "WATCH") return "#E65100";
  return "#2E7D32";
};

export default function MaterialsScreen() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCost, setNewCost] = useState("");

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowCount = materials.filter((m) => m.status === "LOW").length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Raw Materials</Text>
                <Text style={styles.headerSub}>{materials.length} items · {lowCount} low stock</Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {/* Low stock alert */}
            {lowCount > 0 && (
              <View style={styles.alertCard}>
                <Ionicons name="alert-circle-outline" size={18} color="#C62828" />
                <Text style={styles.alertText}>
                  {lowCount} material{lowCount > 1 ? "s are" : " is"} below reorder level. Order soon.
                </Text>
              </View>
            )}

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

            {/* Materials list */}
            <View style={styles.list}>
              {filtered.map((mat, i) => {
                const badge = getStatusStyle(mat.status);
                return (
                  <View
                    key={mat.id}
                    style={[styles.item, i === filtered.length - 1 && { borderBottomWidth: 0 }]}
                  >
                    <View style={styles.itemTop}>
                      <View style={styles.itemIcon}>
                        <Ionicons name="cube-outline" size={18} color="#1565C0" />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{mat.name}</Text>
                        <Text style={styles.itemStock}>
                          {mat.stock}{mat.unit} remaining · GHS {mat.cost}/{mat.unit}
                        </Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressTrack}>
                      <View style={[
                        styles.progressFill,
                        {
                          width: getProgressWidth(mat.stock, mat.reorder),
                          backgroundColor: getProgressColor(mat.status)
                        }
                      ]} />
                    </View>
                    <Text style={styles.reorderText}>
                      Reorder at {mat.reorder}{mat.unit}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Buy from marketplace */}
            <TouchableOpacity
              style={styles.marketplaceBtn}
              onPress={() => router.push("/(manager)/marketplace")}
            >
              <Ionicons name="cart-outline" size={18} color="#1565C0" />
              <Text style={styles.marketplaceBtnText}>Buy from marketplace</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        {/* Add material modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add new material</Text>

              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Cotton Fabric"
                placeholderTextColor="#aaa"
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.modalLabel}>Unit</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. kg, L, units"
                placeholderTextColor="#aaa"
                value={newUnit}
                onChangeText={setNewUnit}
              />

              <Text style={styles.modalLabel}>Current stock</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 100"
                placeholderTextColor="#aaa"
                value={newStock}
                onChangeText={setNewStock}
                keyboardType="numeric"
              />

              <Text style={styles.modalLabel}>Cost per unit (GHS)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 12"
                placeholderTextColor="#aaa"
                value={newCost}
                onChangeText={setNewCost}
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSave}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.modalSaveText}>Add material</Text>
                </TouchableOpacity>
              </View>
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
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  body: { padding: 16 },
  alertCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFEBEE", borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: "#C62828" },
  alertText: { flex: 1, fontSize: 12, color: "#C62828", lineHeight: 17 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 13, color: "#1A1A1A" },
  list: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 14 },
  item: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  itemStock: { fontSize: 10, color: "#888", marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  progressTrack: { height: 4, backgroundColor: "#F0F0F0", borderRadius: 4, marginBottom: 4 },
  progressFill: { height: 4, borderRadius: 4 },
  reorderText: { fontSize: 10, color: "#aaa" },
  marketplaceBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 14, marginBottom: 24 },
  marketplaceBtnText: { fontSize: 13, fontWeight: "500", color: "#1565C0" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 16 },
  modalLabel: { fontSize: 12, fontWeight: "500", color: "#1A1A1A", marginBottom: 6 },
  modalInput: { backgroundColor: "#F5F7FA", borderRadius: 8, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 11, fontSize: 13, color: "#1A1A1A", marginBottom: 14 },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 6 },
  modalCancel: { flex: 1, backgroundColor: "#F5F5F5", borderRadius: 8, padding: 13, alignItems: "center" },
  modalCancelText: { fontSize: 14, color: "#888", fontWeight: "500" },
  modalSave: { flex: 1, backgroundColor: "#1565C0", borderRadius: 8, padding: 13, alignItems: "center" },
  modalSaveText: { fontSize: 14, color: "#fff", fontWeight: "500" },
});