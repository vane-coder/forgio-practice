import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getToken } from "../../auth";
import { getBreakdownLogs } from "../../services/machines.service";
import { colors } from "../../constants/Colors";

export default function MachineHistoryScreen() {
  const { machineId, machineName } = useLocalSearchParams<{ machineId?: string; machineName?: string }>();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getBreakdownLogs(token);
          const all = Array.isArray(data) ? data : [];
          setLogs(machineId ? all.filter((l) => l.machineId === machineId) : all);
        }
      } catch (e) { console.log("breakdown logs load failed", e); }
      finally { setLoading(false); }
    })();
  }, [machineId]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{machineName || "Machine"} history</Text>
            <Text style={styles.headerSub}>{logs.length} breakdown {logs.length === 1 ? "report" : "reports"}</Text>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}
            {!loading && logs.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>No breakdowns recorded</Text>
              </View>
            )}
            {!loading && logs.map((log) => {
              const resolved = log.resolved;
              return (
                <View key={log.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconWrap, { backgroundColor: resolved ? colors.successBg : colors.dangerBg }]}>
                      <Ionicons
                        name={resolved ? "checkmark-circle-outline" : "warning-outline"}
                        size={18}
                        color={resolved ? colors.success : colors.danger}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.machineName}>{log.machineName || "Machine"}</Text>
                      <Text style={styles.cause}>{log.cause || log.message || "Breakdown reported"}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: resolved ? colors.successBg : colors.dangerBg }]}>
                      <Text style={[styles.badgeText, { color: resolved ? colors.success : colors.danger }]}>
                        {resolved ? "Resolved" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.footerText}>{log.reportedByName || "Unknown"}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.footerText}>
                        {log.startTime ? new Date(log.startTime).toLocaleString() : ""}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
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
  empty: { alignItems: "center", marginVertical: 50, gap: 10 },
  emptyText: { fontSize: 13, color: colors.textMuted },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center" },
  machineName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  cause: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: colors.border, marginVertical: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: colors.textMuted },
});
