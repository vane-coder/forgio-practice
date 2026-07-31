import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { getToken } from "../../auth";
import { getMaterials } from "../../services/materials.service";
import { getMachines } from "../../services/machines.service";
import { colors } from "../../constants/Colors";

export default function DashboardScreen() {
  const [username, setUsername] = useState("");
  const [initials, setInitials] = useState("");
  const [materialCount, setMaterialCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);
  const [aiInsight, setAiInsight] = useState("Loading insights...");

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const token = await getToken();
          if (!token) return;


          // real logged-in user
          try {
            const { API_BASE_URL } = await import("../../services/api.config");
            const res = await fetch(`${API_BASE_URL}/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const p = await res.json();
              setUsername(p.name || "");
              setInitials(
                (p.name || "?")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              );
            }
          } catch { }
          // materials
          try {
            const mats = await getMaterials(token);
            if (Array.isArray(mats)) {
              setMaterialCount(mats.length);
              setLowStockCount(mats.filter((m: any) => m.lowStock).length);
            }
          } catch { }

          // machines
          try {
            const machines = await getMachines(token);
            if (Array.isArray(machines)) setMachineCount(machines.length);
          } catch { }

          // AI insight
          try {
            const res = await fetch(
              `${(await import("../../services/api.config")).API_BASE_URL}/ai/suggestions`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
              const data = await res.json();
              setAiInsight(data.suggestion || "No insights available right now.");
            } else {
              setAiInsight("No insights available right now.");
            }
          } catch {
            setAiInsight("No insights available right now.");
          }
        } catch (e) {
          console.log("Dashboard load error", e);
        }
      })();
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.subheader}>
              <View>
                <Text style={styles.greeting}>Good morning</Text>
                <Text style={styles.username}>{username}</Text>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(manager)/profile")}>
                <Text style={styles.avatarText}>{initials}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productionCard}>
              <Text style={styles.productionLabel}>Today's production</Text>
              <Text style={styles.productionRow}>
                <Text style={styles.productionNumber}>1,240 </Text>
                <Text style={styles.productionUnit}>units</Text>
              </Text>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Materials</Text>
                <Text style={styles.statNumber}>{materialCount}</Text>
                <Text style={styles.statSub}>{lowStockCount} low stock</Text>
              </View>
              <View style={styles.statCardAlt}>
                <Text style={styles.statLabelAlt}>Machines</Text>
                <Text style={styles.statNumber}>{machineCount}</Text>
                <Text style={styles.statSub}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Workers</Text>
                <Text style={styles.statNumber}>—</Text>
                <Text style={styles.statSub}>On shift</Text>
              </View>
            </View>

            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                <Text style={styles.aiTitle}>AI Insight</Text>
              </View>
              <Text style={styles.aiText}>{aiInsight}</Text>
            </View>

            <Text style={styles.sectionTitle}>Quick actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/permissions")}>
                <Ionicons name="people-outline" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Workers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/machines")}>
                <Ionicons name="construct-outline" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Machines</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/marketplace")}>
                <Ionicons name="cart-outline" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Market</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/materials")}>
                <Ionicons name="cube-outline" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Materials</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Production entry submitted</Text>
                <Text style={styles.activitySub}>Cutting dept · 2h ago</Text>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>Done</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Ionicons name="partly-sunny-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.weatherTitle}>Weather alert</Text>
                <Text style={styles.weatherText}>Heavy rain expected in Kumasi tomorrow. Secure outdoor materials.</Text>
              </View>
            </View>

          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={22} color={colors.accent} />
            <Text style={styles.navTextActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(manager)/reports")}>
            <Ionicons name="bar-chart-outline" size={22} color={colors.textMuted} />
            <Text style={styles.navText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(manager)/departments")}>
            <Ionicons name="business-outline" size={22} color={colors.textMuted} />
            <Text style={styles.navText}>Departments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(manager)/profile")}>
            <Ionicons name="person-outline" size={22} color={colors.textMuted} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  subheader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 },
  greeting: { fontSize: 13, color: colors.headerSubtitle },
  username: { fontSize: 20, fontWeight: "500", color: colors.white, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 15, fontWeight: "500", color: colors.headerSubtitle },
  productionCard: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 14, width: "100%" },
  productionLabel: { fontSize: 11, color: colors.headerSubtitle },
  productionRow: { marginTop: 4 },
  productionNumber: { fontSize: 28, fontWeight: "500", color: colors.white },
  productionUnit: { fontSize: 14, color: colors.headerSubtitle },
  body: { padding: 16 },
  statRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: colors.blueTint, borderRadius: 10, padding: 12 },
  statCardAlt: { flex: 1, backgroundColor: colors.accentLight, borderRadius: 10, padding: 12 },
  statLabel: { fontSize: 10, color: colors.primary },
  statLabelAlt: { fontSize: 10, color: colors.accent },
  statNumber: { fontSize: 20, fontWeight: "500", color: colors.textDark, marginTop: 4 },
  statSub: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  aiCard: { backgroundColor: colors.warningBg, borderRadius: 10, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: colors.warning },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  aiTitle: { fontSize: 12, fontWeight: "500", color: colors.warning },
  aiText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: "500", color: colors.textDark, marginBottom: 10 },
  actionsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionCard: { flex: 1, backgroundColor: colors.white, borderRadius: 10, padding: 12, alignItems: "center", gap: 6, borderWidth: 0.5, borderColor: colors.border },
  actionText: { fontSize: 10, color: colors.textDark, fontWeight: "500" },
  activityItem: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: colors.border, gap: 10 },
  activityIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 12, fontWeight: "500", color: colors.textDark },
  activitySub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  badgeGreen: { backgroundColor: colors.successBg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeGreenText: { fontSize: 10, color: colors.success },
  weatherCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, marginTop: 6, marginBottom: 20 },
  weatherTitle: { fontSize: 12, fontWeight: "500", color: colors.primary },
  weatherText: { fontSize: 11, color: colors.primary, marginTop: 2, lineHeight: 16 },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.white },
  navItem: { alignItems: "center", gap: 3 },
  navTextActive: { fontSize: 10, color: colors.accent },
  navText: { fontSize: 10, color: colors.textMuted },
});