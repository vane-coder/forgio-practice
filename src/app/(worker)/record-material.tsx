import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMaterials, updateMaterial } from "../../services/materials.service";
import { colors } from "../../constants/Colors";

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
          const used = parseFloat(qty);
          const currentStock = Number(mat?.quantityInStock ?? 0);
          const newStock = Math.max(0, currentStock - used);
          return updateMaterial(token, id, { name: mat?.name, quantityInStock: newStock });
        })
      );
      Alert.alert("Saved", "Material usage recorded.");
      router.push("/(worker)/home");
    } catch { Alert.alert("Error", "Failed to save material usage."); }
    finally { setSaving(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Record materials used</Text>
            <Text style={styles.headerSub}>Enter quantities used this shift</Text>
          </View>

          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
            ) : (
              <>
                <View style={styles.list}>
                  {materials.map((mat, i) => (
                    <View key={mat.materialId} style={[styles.item, i === materials.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={styles.itemIcon}>
                        <Ionicons name="cube-outline" size={18} color={colors.primary} />
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{mat.name}</Text>
                        <Text style={styles.itemStock}>Stock: {mat.quantityInStock ?? "N/A"} {mat.unit ?? ""}</Text>
                      </View>
                      <TextInput
                        style={styles.qtyInput}
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        value={quantities[mat.materialId] || ""}
                        onChangeText={(val) => setQuantities((prev) => ({ ...prev, [mat.materialId]: val }))}
                        keyboardType="numeric"
                      />
                      <Text style={styles.unit}>{mat.unit ?? ""}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color={colors.white} /> : (
                    <>
                      <Ionicons name="save-outline" size={18} color={colors.white} />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  list: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 20 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  itemStock: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  qtyInput: { width: 56, borderWidth: 0.5, borderColor: colors.border, borderRadius: 8, padding: 8, fontSize: 14, textAlign: "center", color: colors.textDark },
  unit: { fontSize: 12, color: colors.textMuted, width: 24 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 10 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  cancelBtn: { backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: colors.primary, fontWeight: "500" },
});
