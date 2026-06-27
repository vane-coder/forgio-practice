import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const materials = [
  { id: 1, name: "Cotton Fabric", stock: "48kg", unit: "kg" },
  { id: 2, name: "Polyester Thread", stock: "320kg", unit: "kg" },
  { id: 3, name: "Dye Chemical", stock: "87L", unit: "L" },
];

export default function RecordMaterialScreen() {
  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});

  const updateQty = (id: number, val: string) => {
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Record materials used</Text>
            <Text style={styles.headerSub}>Enter quantities used this shift</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.list}>
              {materials.map((mat, i) => (
                <View key={mat.id} style={[styles.item, i === materials.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.itemIcon}>
                    <Ionicons name="cube-outline" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{mat.name}</Text>
                    <Text style={styles.itemStock}>Stock: {mat.stock}</Text>
                  </View>
                  <TextInput
                    style={styles.qtyInput}
                    placeholder="0"
                    placeholderTextColor="#aaa"
                    value={quantities[mat.id] || ""}
                    onChangeText={(val) => updateQty(mat.id, val)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unit}>{mat.unit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={16} color="#1565C0" />
              <Text style={styles.addBtnText}>Add another material</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => router.push("/(worker)/my-records")}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Save usage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16 },
  list: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 12 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  itemStock: { fontSize: 10, color: "#888", marginTop: 2 },
  qtyInput: { width: 56, borderWidth: 0.5, borderColor: "#ccc", borderRadius: 8, padding: 8, fontSize: 14, textAlign: "center", color: "#1A1A1A" },
  unit: { fontSize: 12, color: "#888", width: 20 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, padding: 4, marginBottom: 20 },
  addBtnText: { fontSize: 13, color: "#1565C0", fontWeight: "500" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});