import React, { useState, useCallback} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect } from "expo-router";
import { getToken } from "../../auth";
import { getMyProduction } from "../../services/production.service";
import { colors } from "../../constants/Colors";

export default function MyRecordsScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const production = await getMyProduction(token).catch(() => []);
        setRecords(Array.isArray(production) ? production : []);
      } catch (e) {
        console.log("my-records load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []));

  const totalUnits = records.reduce((sum, r) => sum + (r.quantityProduced || 0), 0);
  const avgPerDay = records.length > 0 ? Math.round(totalUnits / records.length) : 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My records</Text>
            <Text style={styles.headerSub}>{records.length} entries</Text>
          </View>

          <View style={styles.body}>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
            ) : (
              <>
                {/* Summary card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNumber}>{totalUnits}</Text>
                    <Text style={styles.summaryLabel}>Total units</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNumber}>{records.length}</Text>
                    <Text style={styles.summaryLabel}>Entries</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNumber}>{avgPerDay}</Text>
                    <Text style={styles.summaryLabel}>Avg/entry</Text>
                  </View>
                </View>

                {/* Records list */}
                {records.length === 0 ? (
                  <Text style={{ textAlign: "center", color: colors.textMuted, marginVertical: 30 }}>
                    No production records yet
                  </Text>
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>Recent entries</Text>
                    <View style={styles.list}>
                      {records.map((r, i) => (
                        <View key={r.entryId} style={[styles.item, i === records.length - 1 && { borderBottomWidth: 0 }]}>
                          <View style={styles.itemLeft}>
                            <Text style={styles.itemProduct}>{r.productName}</Text>
                            <Text style={styles.itemMeta}>
                              {new Date(r.entryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {r.shift} shift
                            </Text>
                          </View>
                          <View style={styles.itemRight}>
                            <Text style={styles.itemQty}>{r.quantityProduced} units</Text>
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>Submitted</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={styles.newEntryBtn}
                  onPress={() => router.push("/(worker)/enter-production")}
                >
                  <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                  <Text style={styles.newEntryBtnText}>New entry</Text>
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
  summaryCard: { flexDirection: "row", backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, marginBottom: 20, justifyContent: "space-around" },
  summaryItem: { alignItems: "center" },
  summaryNumber: { fontSize: 22, fontWeight: "500", color: colors.primary },
  summaryLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  summaryDivider: { width: 0.5, backgroundColor: colors.border },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 10 },
  list: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 14 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemLeft: { flex: 1 },
  itemProduct: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  itemMeta: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  itemRight: { alignItems: "flex-end", gap: 4 },
  itemQty: { fontSize: 13, fontWeight: "500", color: colors.primary },
  badge: { backgroundColor: colors.successBg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 9, color: colors.success },
  newEntryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 24 },
  newEntryBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
});