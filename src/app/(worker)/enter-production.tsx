import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { submitProduction } from "../../services/production.service";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Enter production</Text>
            <Text style={styles.headerSub}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.label}>Product name</Text>
            <TextInput style={styles.input} placeholder="e.g. Cotton shirt" placeholderTextColor="#aaa" value={product} onChangeText={setProduct} />
            <Text style={styles.label}>Quantity produced</Text>
            <TextInput style={styles.input} placeholder="e.g. 120" placeholderTextColor="#aaa" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <Text style={styles.label}>Shift</Text>
            <View style={styles.chipRow}>
              {["MORNING", "AFTERNOON", "NIGHT"].map((s) => (
                <TouchableOpacity key={s} style={[styles.chip, shift === s && styles.chipActive]} onPress={() => setShift(s)}>
                  <Text style={[styles.chipText, shift === s && styles.chipTextActive]}>{s.charAt(0) + s.slice(1).toLowerCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput style={styles.textArea} placeholder="Any additional notes..." placeholderTextColor="#aaa" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 14, color: "#1A1A1A", marginBottom: 16 },
  chipRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0" },
  chipActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  chipText: { fontSize: 13, color: "#888" },
  chipTextActive: { color: "#fff", fontWeight: "500" },
  textArea: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 13, color: "#1A1A1A", minHeight: 80, textAlignVertical: "top", marginBottom: 20 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  submitBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});
