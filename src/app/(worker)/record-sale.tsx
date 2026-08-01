import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMaterials } from "../../services/materials.service";
import { createSale } from "../../services/sales.service";
import { colors } from "../../constants/Colors";

export default function RecordSaleScreen() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [soldTo, setSoldTo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMaterials(token).catch(() => []);
          setMaterials(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("materials load failed", e); }
    })();
  }, []);

  const pickMaterial = (mat: any) => {
    if (materialId === mat.materialId) {
      // deselect → back to free-typed item
      setMaterialId("");
      return;
    }
    setMaterialId(mat.materialId);
    setItemName(mat.name);
    setUnit(mat.unit ?? "");
  };

  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  const total = qty * price;

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert("Missing item", "Enter or pick what was sold."); return; }
    if (qty <= 0) { Alert.alert("Invalid quantity", "Enter a quantity greater than zero."); return; }
    if (price < 0) { Alert.alert("Invalid price", "Enter a valid unit price."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return;
      await createSale(token, {
        materialId: materialId || undefined,
        itemName: itemName.trim(),
        quantity: qty,
        unit: unit.trim() || undefined,
        unitPrice: price,
        soldTo: soldTo.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      Alert.alert("Recorded", "Sale recorded and sent to your manager.");
      router.push("/(worker)/home");
    } catch { Alert.alert("Error", "Failed to record sale."); }
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
            <Text style={styles.headerTitle}>Record a sale</Text>
            <Text style={styles.headerSub}>Log goods sold — your manager is notified</Text>
          </View>

          <View style={styles.body}>
            {materials.length > 0 && (
              <>
                <Text style={styles.label}>Pick from stock (optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  <View style={styles.chipRow}>
                    {materials.map((m) => (
                      <TouchableOpacity
                        key={m.materialId}
                        style={[styles.chip, materialId === m.materialId && styles.chipActive]}
                        onPress={() => pickMaterial(m)}
                      >
                        <Text style={[styles.chipText, materialId === m.materialId && styles.chipTextActive]}>{m.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}

            <Text style={styles.label}>Item sold</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Finished shirts"
              placeholderTextColor={colors.textMuted}
              value={itemName}
              onChangeText={setItemName}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. pcs, kg"
                  placeholderTextColor={colors.textMuted}
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            <Text style={styles.label}>Price per unit (GHS)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={unitPrice}
              onChangeText={setUnitPrice}
              keyboardType="numeric"
            />

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>GHS {total.toFixed(2)}</Text>
            </View>

            <Text style={styles.label}>Sold to (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Customer or buyer name"
              placeholderTextColor={colors.textMuted}
              value={soldTo}
              onChangeText={setSoldTo}
            />

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any extra details"
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.white} /> : (
                <>
                  <Ionicons name="cash-outline" size={18} color={colors.white} />
                  <Text style={styles.saveBtnText}>Record sale</Text>
                </>
              )}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  label: { fontSize: 12, color: colors.textMuted, fontWeight: "500", marginBottom: 6 },
  input: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 14, color: colors.textDark, marginBottom: 14 },
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextActive: { color: colors.white, fontWeight: "500" },
  totalCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, marginBottom: 14 },
  totalLabel: { fontSize: 13, color: colors.primary, fontWeight: "500" },
  totalValue: { fontSize: 16, color: colors.primary, fontWeight: "600" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 10 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  cancelBtn: { backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: colors.primary, fontWeight: "500" },
});
