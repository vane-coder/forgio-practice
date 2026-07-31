import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { submitProduction } from "../../services/production.service";
import { colors } from "../../constants/Colors";

export default function EnterProductionScreen() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shift, setShift] = useState("MORNING");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!product.trim() || !quantity.trim()) { Alert.alert("Missing fields", "Product name and quantity are required."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await submitProduction(token, {
          productName: product.trim(),
          quantityProduced: parseInt(quantity, 10),
          shift,
          notes: notes.trim() || undefined,
        });
        Alert.alert("Submitted", "Production entry recorded.");
        router.push("/(worker)/record-material");
      }
    } catch { Alert.alert("Error", "Failed to submit production entry."); }
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
            <Text style={styles.headerTitle}>Enter production</Text>
            <Text style={styles.headerSub}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.label}>Product name</Text>
            <TextInput style={styles.input} placeholder="e.g. Cotton shirt" placeholderTextColor={colors.textMuted} value={product} onChangeText={setProduct} />
            <Text style={styles.label}>Quantity produced</Text>
            <TextInput style={styles.input} placeholder="e.g. 120" placeholderTextColor={colors.textMuted} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <Text style={styles.label}>Shift</Text>
            <View style={styles.chipRow}>
              {["MORNING", "AFTERNOON", "NIGHT"].map((s) => (
                <TouchableOpacity key={s} style={[styles.chip, shift === s && styles.chipActive]} onPress={() => setShift(s)}>
                  <Text style={[styles.chipText, shift === s && styles.chipTextActive]}>{s.charAt(0) + s.slice(1).toLowerCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput style={styles.textArea} placeholder="Any additional notes..." placeholderTextColor={colors.textMuted} value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.white} /> : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.submitBtnText}>Submit entry</Text>
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
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  input: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 14, color: colors.textDark, marginBottom: 16 },
  chipRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: colors.white, fontWeight: "500" },
  textArea: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 13, color: colors.textDark, minHeight: 80, textAlignVertical: "top", marginBottom: 20 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 10 },
  submitBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  cancelBtn: { backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: colors.primary, fontWeight: "500" },
});
