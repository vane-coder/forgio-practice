import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { getMaterials } from "../../services/materials.service";
import { getMachines, getBreakdownLogs } from "../../services/machines.service";
import { getProductionByFactory } from "../../services/production.service";
import { getWorkersWithPermissions } from "../../services/permissions.service";
import { getShipments } from "../../services/shipment.service";
import { getNewsFeed } from "../../services/newsfeed.service";
import { colors } from "../../constants/Colors";
import ManagerSidebar from "../../components/ManagerSidebar";

type Activity = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  sub: string;
  time: number; // ms epoch for sorting
  route?: string;
  params?: Record<string, string>;
};

const isToday = (iso?: string) => {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const relativeTime = (iso?: string) => {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export default function DashboardScreen() {
  const [username, setUsername] = useState("");
  const [initials, setInitials] = useState("");
  const [materialCount, setMaterialCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);
  const [workerCount, setWorkerCount] = useState<number | null>(null);
  const [todayProduction, setTodayProduction] = useState<number | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [aiInsight, setAiInsight] = useState("Loading insights...");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = React.useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // real logged-in user
      try {
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

      // workers
      try {
        const workers = await getWorkersWithPermissions(token);
        if (Array.isArray(workers)) setWorkerCount(workers.length);
      } catch { }

      // today's production + recent production activity
      let prodActivity: Activity[] = [];
      try {
        const entries = await getProductionByFactory(token);
        if (Array.isArray(entries)) {
          const total = entries
            .filter((e: any) => isToday(e.entryDate))
            .reduce((sum: number, e: any) => sum + (Number(e.quantityProduced) || 0), 0);
          setTodayProduction(total);
          prodActivity = entries.map((e: any) => ({
            id: `prod-${e.entryId}`,
            icon: "cube-outline" as const,
            color: colors.success,
            title: `${e.quantityProduced} ${e.productName || "units"} produced`,
            sub: relativeTime(e.entryDate),
            time: new Date(e.entryDate).getTime() || 0,
            route: "/(manager)/reports",
          }));
        }
      } catch { }

      // recent shipments activity
      let shipActivity: Activity[] = [];
      try {
        const shipments = await getShipments(token);
        if (Array.isArray(shipments)) {
          shipActivity = shipments.map((s: any) => {
            const ts = s.arrivedAt || s.departedAt || s.createdAt;
            return {
              id: `ship-${s.shipmentId}`,
              icon: "navigate-outline" as const,
              color: colors.primary,
              title: `Shipment ${String(s.status || "").replace("_", " ").toLowerCase()}`,
              sub: `${s.fromBranchName ?? "Origin"} → ${s.toBranchName ?? "Destination"} · ${relativeTime(ts)}`,
              time: new Date(ts).getTime() || 0,
              route: s.status === "IN_TRANSIT" ? "/(manager)/live-tracking" : "/(manager)/shipments",
              params: s.status === "IN_TRANSIT" ? { shipmentId: s.shipmentId } : undefined,
            };
          });
        }
      } catch { }

      // recent newsfeed activity
      let newsActivity: Activity[] = [];
      try {
        const posts = await getNewsFeed(token);
        if (Array.isArray(posts)) {
          newsActivity = posts.map((p: any) => ({
            id: `news-${p.postId}`,
            icon: "newspaper-outline" as const,
            color: colors.accent,
            title: `${p.authorName || "Staff"} posted an update`,
            sub: relativeTime(p.createdAt),
            time: new Date(p.createdAt).getTime() || 0,
            route: "/(manager)/newsfeed",
          }));
        }
      } catch { }

      // recent breakdown activity
      let breakdownActivity: Activity[] = [];
      try {
        const logs = await getBreakdownLogs(token);
        if (Array.isArray(logs)) {
          breakdownActivity = logs.map((l: any) => ({
            id: `breakdown-${l.id}`,
            icon: "warning-outline" as const,
            color: colors.danger,
            title: `${l.machineName || "Machine"} breakdown${l.resolved ? " resolved" : ""}`,
            sub: `${l.cause || l.message || "Reported"} · ${relativeTime(l.startTime)}`,
            time: new Date(l.startTime).getTime() || 0,
            route: "/(manager)/machine-history",
            params: l.machineId ? { machineId: l.machineId, machineName: l.machineName || "Machine" } : undefined,
          }));
        }
      } catch { }

      const merged = [...prodActivity, ...shipActivity, ...newsActivity, ...breakdownActivity]
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);
      setActivity(merged);

      // AI insight
      try {
        const res = await fetch(`${API_BASE_URL}/ai/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      load();
      const t = setInterval(load, 30000);
      return () => clearInterval(t);
    }, [load])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.subheader}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarOpen(true)}>
                  <Ionicons name="menu-outline" size={26} color={colors.white} />
                </TouchableOpacity>
                <View>
                  <Text style={styles.greeting}>Good morning</Text>
                  <Text style={styles.username}>{username}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(manager)/profile")}>
                <Text style={styles.avatarText}>{initials}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productionCard}>
              <Text style={styles.productionLabel}>Today's production</Text>
              <Text style={styles.productionRow}>
                <Text style={styles.productionNumber}>
                  {todayProduction === null ? "…" : todayProduction.toLocaleString()}{" "}
                </Text>
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
                <Text style={styles.statNumber}>{workerCount === null ? "—" : workerCount}</Text>
                <Text style={styles.statSub}>Total</Text>
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

            {activity.length === 0 && (
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>No recent activity</Text>
                  <Text style={styles.activitySub}>Updates will appear here</Text>
                </View>
              </View>
            )}

            {activity.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={styles.activityItem}
                activeOpacity={a.route ? 0.6 : 1}
                disabled={!a.route}
                onPress={() => {
                  if (a.route) router.push(a.params ? { pathname: a.route as any, params: a.params } : (a.route as any));
                }}
              >
                <View style={styles.activityIcon}>
                  <Ionicons name={a.icon} size={20} color={a.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activitySub}>{a.sub}</Text>
                </View>
                {a.route && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
              </TouchableOpacity>
            ))}

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

        <ManagerSidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  subheader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  greeting: { fontSize: 13, color: colors.headerSubtitle },
  username: { fontSize: 20, fontWeight: "500", color: colors.white, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 15, fontWeight: "500", color: colors.primary },
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
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.white },
  navItem: { alignItems: "center", gap: 3 },
  navTextActive: { fontSize: 10, color: colors.accent },
  navText: { fontSize: 10, color: colors.textMuted },
});