import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect} from "expo-router";
import { getToken } from "../../auth";
import { getSales } from "../../services/sales.service";
import { colors } from "../../constants/Colors";

export default function SalesScreen() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getSales(token).catch(() => []);
          setSales(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("sales load failed", e); }
      finally { setLoading(false); }
    })();
  }, []));

  const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sales</Text>
            <Text style={styles.headerSub}>{sales.length} sales · GHS {totalRevenue.toFixed(2)} total</Text>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}

            {!loading && sales.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="cash-outline" size={40} color={colors.border} />
                <Text style={styles.emptyText}>No sales recorded yet</Text>
              </View>
            )}

            {!loading && sales.map((s) => (
              <View key={s.saleId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.icon}><Ionicons name="cash-outline" size={20} color={colors.success} /></View>
                  <View style={styles.info}>
                    <Text style={styles.itemName}>{s.itemName}</Text>
                    <Text style={styles.sub}>{s.quantity} {s.unit || ""} · GHS {s.unitPrice}/unit</Text>
                  </View>
                  <Text style={styles.total}>GHS {s.total}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Ionicons name="person-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.footerText}>{s.soldByName || "Worker"}</Text>
                  </View>
                  {s.soldTo ? (
                    <View style={styles.footerItem}>
                      <Ionicons name="arrow-forward-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.footerText}>{s.soldTo}</Text>
                    </View>
                  ) : null}
                  <View style={styles.footerItem}>
                    <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.footerText}>
                      {s.soldAt ? new Date(s.soldAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                    </Text>
                  </View>
                </View>
                {s.notes ? <Text style={styles.notes}>{s.notes}</Text> : null}
              </View>
            ))}
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
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successBg, justifyContent: "center", alignItems: "center" },
  info: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  total: { fontSize: 14, fontWeight: "600", color: colors.success },
  divider: { height: 0.5, backgroundColor: colors.border, marginVertical: 12 },
  cardFooter: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: colors.textMuted },
  notes: { fontSize: 11, color: colors.textMuted, marginTop: 10, fontStyle: "italic" },
});
