import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const reportData = {
  totalProduced: "6,240",
  totalWaste: "8.2%",
  estimatedProfit: "GHS 4,200",
  downtime: "3.4 hrs",
};

const recentReports = [
  { id: 1, title: "Week 16 Report", period: "14 Apr – 20 Apr 2026" },
  { id: 2, title: "Week 15 Report", period: "7 Apr – 13 Apr 2026" },
  { id: 3, title: "March Monthly", period: "1 Mar – 31 Mar 2026" },
];

export default function ReportsScreen() {
  const [period, setPeriod] = useState("week");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Reports</Text>
              <Text style={styles.headerSub}>Production and waste summary</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>

            <View style={styles.periodRow}>
              {["week", "month", "custom"].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodTab, period === p && styles.periodTabActive]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.statGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total produced</Text>
                <Text style={styles.statNumber}>{reportData.totalProduced}</Text>
                <Text style={[styles.statChange, { color: "#2E7D32" }]}>↑ +12% this week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total waste</Text>
                <Text style={styles.statNumber}>{reportData.totalWaste}</Text>
                <Text style={[styles.statChange, { color: "#C62828" }]}>↑ +2% this week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Est. profit</Text>
                <Text style={styles.statNumber}>{reportData.estimatedProfit}</Text>
                <Text style={styles.statChange}>This week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Downtime</Text>
                <Text style={styles.statNumber}>{reportData.downtime}</Text>
                <Text style={styles.statChange}>This week</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.generateBtn}>
              <Ionicons name="document-text-outline" size={18} color="#fff" />
              <Text style={styles.generateBtnText}>Generate new report</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Recent reports</Text>
            <View style={styles.reportList}>
              {recentReports.map((r, i) => (
                <View key={r.id} style={[styles.reportItem, i === recentReports.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.reportIcon}>
                    <Ionicons name="document-outline" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{r.title}</Text>
                    <Text style={styles.reportPeriod}>{r.period}</Text>
                  </View>
                  <TouchableOpacity style={styles.reportDownload}>
                    <Ionicons name="download-outline" size={16} color="#1565C0" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  downloadBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  body: { padding: 16 },
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  periodTab: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0" },
  periodTabActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  periodText: { fontSize: 12, color: "#888" },
  periodTextActive: { color: "#fff", fontWeight: "500" },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statCard: { width: "47%", backgroundColor: "#E3F2FD", borderRadius: 10, padding: 12 },
  statLabel: { fontSize: 10, color: "#1565C0" },
  statNumber: { fontSize: 20, fontWeight: "500", color: "#1A1A1A", marginTop: 4 },
  statChange: { fontSize: 10, color: "#888", marginTop: 2 },
  generateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 20 },
  generateBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 10 },
  reportList: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 24 },
  reportItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  reportIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 12, fontWeight: "500", color: "#1A1A1A" },
  reportPeriod: { fontSize: 10, color: "#888", marginTop: 2 },
  reportDownload: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
});