import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getAISuggestions } from "../../services/ai.service";
import { colors } from "../../constants/Colors";

export default function AIAssistantScreen() {
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [insight, setInsight] = useState("");

  const loadInsight = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const data = await getAISuggestions(token);
        setInsight(data.suggestion || "No insights available right now.");
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (e) {
      setInsight("Could not load insights.");
      console.log("ai load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInsight(); }, []);

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
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <Text style={styles.headerSub}>Powered by Forgio Intelligence</Text>
              </View>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.refreshRow}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={styles.refreshTime}>Last updated: {lastRefreshed}</Text>
            </View>

            {/* Live insight from the backend */}
            <View style={[styles.card, styles.insightCard, { backgroundColor: colors.warningBg, borderColor: colors.warning }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="bulb-outline" size={15} color={colors.warning} />
                <Text style={[styles.cardTitle, { color: "#854F0B" }]}>Today's insight</Text>
              </View>
              {loading ? (
                <ActivityIndicator size="small" color={colors.warning} style={{ marginTop: 8 }} />
              ) : (
                <Text style={[styles.cardText, { color: "#633806" }]}>{insight}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={loadInsight}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="refresh-outline" size={16} color={colors.white} />
                  <Text style={styles.refreshBtnText}>Refresh insights</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.noteText}>
                Insights are generated from your factory's production, stock and machine data.
              </Text>
            </View>

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
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  aiBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.blueTint, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  aiBadgeText: { fontSize: 11, fontWeight: "500", color: colors.primary },
  body: { padding: 16 },
  refreshRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 12 },
  refreshTime: { fontSize: 11, color: colors.textMuted },
  card: { borderRadius: 12, borderWidth: 0.5, padding: 14, marginBottom: 12 },
  insightCard: { borderLeftWidth: 3 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  cardTitle: { fontSize: 12, fontWeight: "500" },
  cardText: { fontSize: 12, lineHeight: 18 },
  refreshBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 14 },
  refreshBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  noteCard: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: colors.blueTint, borderRadius: 10, padding: 12, marginBottom: 24 },
  noteText: { flex: 1, fontSize: 11, color: colors.primary, lineHeight: 16 },
});