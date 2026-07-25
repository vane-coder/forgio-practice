import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMaterials, updateMaterial } from "../../services/materials.service";

export default function RecordMaterialScreen() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMaterials(token);
          setMaterials(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("materials load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    const entries = Object.entries(quantities).filter(([, v]) => v && parseFloat(v) > 0);
    if (entries.length === 0) { Alert.alert("Nothing to save", "Enter usage for at least one material."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      await Promise.all(
        entries.map(([id, qty]) => {
          const mat = materials.find((m) => m.materialId === id);
          return updateMaterial(token, id, { quantityUsed: parseFloat(qty), name: mat?.name });
        })
      );
      Alert.alert("Saved", "Material usage recorded.");
      router.push("/(worker)/home");
    } catch { Alert.alert("Error", "Failed to save material usage."); }
    finally { setSaving(false); }
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
            {loading ? (
              <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />
            ) : (
              <>
                <View style={styles.list}>
                  {materials.map((mat, i) => (
                    <View key={mat.materialId} style={[styles.item, i === materials.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={styles.itemIcon}>
                        <Ionicons name="cube-outline" size={18} color="#1565C0" />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{mat.name}</Text>
                        <Text style={styles.itemStock}>Stock: {mat.quantity ?? "N/A"} {mat.unit ?? ""}</Text>
                      </View>
                      <TextInput
                        style={styles.qtyInput}
                        placeholder="0"
                        placeholderTextColor="#aaa"
                        value={quantities[mat.materialId] || ""}
                        onChangeText={(val) => setQuantities((prev) => ({ ...prev, [mat.materialId]: val }))}
                        keyboardType="numeric"
                      />
                      <Text style={styles.unit}>{mat.unit ?? ""}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <Ionicons name="save-outline" size={18} color="#fff" />
                      <Text style={styles.saveBtnText}>Save usage</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
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
  list: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 20 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  itemStock: { fontSize: 10, color: "#888", marginTop: 2 },
  qtyInput: { width: 56, borderWidth: 0.5, borderColor: "#ccc", borderRadius: 8, padding: 8, fontSize: 14, textAlign: "center", color: "#1A1A1A" },
  unit: { fontSize: 12, color: "#888", width: 24 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});
