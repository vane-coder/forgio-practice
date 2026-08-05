import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect} from "expo-router";
import { getToken } from "../../auth";
import { getReports, generateReport } from "../../services/reports.service";
import { colors } from "../../constants/Colors";

const getPeriodDates = (period: string) => {
  const now = new Date();
  if (period === "week") {
    const start = new Date(now); start.setDate(now.getDate() - 7);
    return { startDate: start.toISOString().split("T")[0], endDate: now.toISOString().split("T")[0] };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: start.toISOString().split("T")[0], endDate: now.toISOString().split("T")[0] };
  }
  const start = new Date(now.getFullYear(), 0, 1);
  return { startDate: start.toISOString().split("T")[0], endDate: now.toISOString().split("T")[0] };
};

export default function ReportsScreen() {
  const [period, setPeriod] = useState("week");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useFocusEffect(
  useCallback(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getReports(token);
          setReports(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("reports load failed", e); }
      finally { setLoading(false); }
    })();
  }, []));

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = await getToken();
      if (!token) return;
      const dates = getPeriodDates(period);
      const result = await generateReport(token, dates);
      setReports((prev) => [result, ...prev]);
      Alert.alert("Done", "Report generated successfully.");
    } catch { Alert.alert("Error", "Failed to generate report."); }
    finally { setGenerating(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Reports</Text>
                <Text style={styles.headerSub}>Production and waste summary</Text>
              </View>
            </View>
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

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} disabled={generating}>
              {generating ? <ActivityIndicator color={colors.white} /> : (
                <>
                  <Ionicons name="document-text-outline" size={18} color={colors.white} />
                  <Text style={styles.generateBtnText}>Generate new report</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Recent reports</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              <View style={styles.reportList}>
                {reports.length === 0 && (
                  <Text style={{ textAlign: "center", color: colors.textMuted, padding: 20 }}>No reports yet</Text>
                )}
                {reports.map((r, i) => (
                  <View key={r.reportId ?? i} style={[styles.reportItem, i === reports.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.reportIcon}>
                      <Ionicons name="document-outline" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportTitle}>{r.title ?? `Report ${i + 1}`}</Text>
                      <Text style={styles.reportPeriod}>
                        {r.startDate && r.endDate ? `${r.startDate} – ${r.endDate}` : r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                      </Text>
                      {(r.productionEntries != null || r.totalProduced != null) && (
                        <View style={styles.metricRow}>
                          <View style={styles.metricChip}>
                            <Ionicons name="cube-outline" size={11} color={colors.primary} />
                            <Text style={styles.metricText}>{r.totalProduced ?? "0"} units</Text>
                          </View>
                          <View style={styles.metricChip}>
                            <Ionicons name="list-outline" size={11} color={colors.primary} />
                            <Text style={styles.metricText}>{r.productionEntries ?? 0} entries</Text>
                          </View>
                          {r.machinesStopped ? (
                            <View style={[styles.metricChip, { backgroundColor: colors.dangerBg }]}>
                              <Ionicons name="alert-circle-outline" size={11} color={colors.danger} />
                              <Text style={[styles.metricText, { color: colors.danger }]}>{r.machinesStopped} stopped</Text>
                            </View>
                          ) : null}
                        </View>
                      )}
                      {r.content ? <Text style={styles.reportContent}>{r.content}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  periodTab: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  periodTabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  periodText: { fontSize: 12, color: colors.textMuted },
  periodTextActive: { color: colors.white, fontWeight: "500" },
  generateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 20 },
  generateBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 10 },
  reportList: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 24 },
  reportItem: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  reportIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 12, fontWeight: "500", color: colors.textDark },
  reportPeriod: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  metricRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  metricChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.blueTint, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  metricText: { fontSize: 10, color: colors.primary, fontWeight: "500" },
  reportContent: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginTop: 8 },
});
