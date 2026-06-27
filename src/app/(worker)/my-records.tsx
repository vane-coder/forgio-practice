import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const records = [
  { id: 1, product: "Cotton shirt", quantity: 120, shift: "Morning", date: "23 Jun 2026", status: "SUBMITTED" },
  { id: 2, product: "Cotton shirt", quantity: 98, shift: "Morning", date: "22 Jun 2026", status: "SUBMITTED" },
  { id: 3, product: "Cotton shirt", quantity: 134, shift: "Morning", date: "21 Jun 2026", status: "SUBMITTED" },
  { id: 4, product: "Cotton shirt", quantity: 110, shift: "Afternoon", date: "20 Jun 2026", status: "SUBMITTED" },
];

export default function MyRecordsScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My records</Text>
            <Text style={styles.headerSub}>{records.length} entries this week</Text>
          </View>

          <View style={styles.body}>

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>462</Text>
                <Text style={styles.summaryLabel}>Total units</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>4</Text>
                <Text style={styles.summaryLabel}>Entries</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>115</Text>
                <Text style={styles.summaryLabel}>Avg/day</Text>
              </View>
            </View>

            {/* Records list */}
            <Text style={styles.sectionTitle}>This week</Text>
            <View style={styles.list}>
              {records.map((r, i) => (
                <View key={r.id} style={[styles.item, i === records.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemProduct}>{r.product}</Text>
                    <Text style={styles.itemMeta}>{r.date} · {r.shift} shift</Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemQty}>{r.quantity} units</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Submitted</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.newEntryBtn}
              onPress={() => router.push("/(worker)/enter-production")}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.newEntryBtnText}>New entry</Text>
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
  summaryCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 16, marginBottom: 20, justifyContent: "space-around" },
  summaryItem: { alignItems: "center" },
  summaryNumber: { fontSize: 22, fontWeight: "500", color: "#1565C0" },
  summaryLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  summaryDivider: { width: 0.5, backgroundColor: "#e0e0e0" },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 10 },
  list: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 14 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemLeft: { flex: 1 },
  itemProduct: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  itemMeta: { fontSize: 10, color: "#888", marginTop: 2 },
  itemRight: { alignItems: "flex-end", gap: 4 },
  itemQty: { fontSize: 13, fontWeight: "500", color: "#1565C0" },
  badge: { backgroundColor: "#E8F5E9", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 9, color: "#2E7D32" },
  newEntryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 24 },
  newEntryBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
});