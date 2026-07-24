import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments } from "../../services/shipment.service";

const getStatusStyle = (status: string) => {
  if (status === "IN_TRANSIT") return { bg: "#E3F2FD", color: "#0C447C", label: "In transit" };
  if (status === "ARRIVED") return { bg: "#E8F5E9", color: "#1B5E20", label: "Arrived" };
  if (status === "DEPARTED") return { bg: "#FFF3E0", color: "#E65100", label: "Departed" };
  return { bg: "#F5F5F5", color: "#666", label: "Pending" };
};

export default function ShipmentsScreen() {
  const [filter, setFilter] = useState("ALL");
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getShipments(token);
          setShipments(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("shipments load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = shipments.filter((s) => filter === "ALL" || s.status === filter);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Shipments</Text>
                <Text style={styles.headerSub}>{shipments.length} total shipments</Text>
              </View>
              <TouchableOpacity style={styles.newBtn} onPress={() => router.push("/(manager)/branches")}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.newBtnText}>New</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.filterRow}>
              {["ALL", "PENDING", "DEPARTED", "IN_TRANSIT", "ARRIVED"].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, filter === f && styles.filterTabActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                    {f === "ALL" ? "All" : f === "IN_TRANSIT" ? "Transit" : f.charAt(0) + f.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {loading && <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />}
            {!loading && filtered.length === 0 && (
              <Text style={{ textAlign: "center", color: "#888", marginVertical: 30 }}>No shipments yet</Text>
            )}

            {!loading && filtered.map((s) => {
              const badge = getStatusStyle(s.status);
              return (
                <View key={s.shipmentId} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.shipmentId}>#{s.shipmentId.substring(0, 8)}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                  <View style={styles.routeRow}>
                    <View style={styles.routeStop}>
                      <Ionicons name="location-outline" size={13} color="#1565C0" />
                      <Text style={styles.routeText}>{s.fromBranchName}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={14} color="#ccc" />
                    <View style={styles.routeStop}>
                      <Ionicons name="flag-outline" size={13} color="#2E7D32" />
                      <Text style={styles.routeText}>{s.toBranchName}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="person-outline" size={12} color="#888" />
                      <Text style={styles.footerText}>{s.driverName || "Unassigned"}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="time-outline" size={12} color="#888" />
                      <Text style={styles.footerText}>
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}
                      </Text>
                    </View>
                  </View>
                  {s.status === "IN_TRANSIT" && (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() => router.push("/(manager)/live-tracking")}
                    >
                      <Ionicons name="navigate-outline" size={14} color="#1565C0" />
                      <Text style={styles.trackBtnText}>Track live</Text>
                    </TouchableOpacity>
                  )}
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  newBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  newBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  body: { padding: 16 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  filterTab: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0" },
  filterTabActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  filterText: { fontSize: 12, color: "#888" },
  filterTextActive: { color: "#fff", fontWeight: "500" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  shipmentId: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  routeStop: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  routeText: { fontSize: 12, color: "#1A1A1A" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: "#888" },
  trackBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#E3F2FD", borderRadius: 8, padding: 10, marginTop: 10 },
  trackBtnText: { fontSize: 12, color: "#1565C0", fontWeight: "500" },
});