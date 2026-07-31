import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments } from "../../services/shipment.service";
import { API_BASE_URL } from "../../services/api.config";
import { colors } from "../../constants/Colors";

export default function ShipmentAssignmentScreen() {
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const profileRes = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = profileRes.ok ? await profileRes.json() : null;
      const myId = profile?.userId ?? profile?.id ?? profile?.sub;

      const all = await getShipments(token);
      const active = Array.isArray(all)
        ? all.filter((s: any) => s.status !== "ARRIVED")
        : [];
      // Match on the driver id under whatever key the profile returns it.
      // Deliberately no "first active shipment" fallback: that could show a
      // driver someone else's delivery if the backend doesn't scope the list.
      const mine = active.find((s: any) => s.driverId === myId) ?? null;
      setShipment(mine);
    } catch (e) {
      console.log("shipment-assignment load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.white} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Shipment</Text>
          </View>
          <View style={[styles.body, { alignItems: "center", paddingTop: 60 }]}>
            <Ionicons name="cube-outline" size={48} color={colors.border} />
            <Text style={{ color: colors.textMuted, marginTop: 12 }}>No active shipment assigned right now.</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const status = shipment.status;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>My Shipment</Text>
                <Text style={styles.headerSub}>#{shipment.shipmentId.substring(0, 8)}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                status === "PENDING" && { backgroundColor: colors.warningBg },
                status === "DEPARTED" && { backgroundColor: "#F3E5F5" },
                status === "IN_TRANSIT" && { backgroundColor: colors.blueTint },
                status === "ARRIVED" && { backgroundColor: colors.successBg },
              ]}>
                <Text style={[
                  styles.statusText,
                  status === "PENDING" && { color: colors.warning },
                  status === "DEPARTED" && { color: "#6A1B9A" },
                  status === "IN_TRANSIT" && { color: colors.primary },
                  status === "ARRIVED" && { color: colors.success },
                ]}>
                  {status.replace("_", " ")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.routeCard}>
              <View style={styles.routeRow}>
                <View style={styles.routeIconCol}>
                  <View style={styles.routeDotBlue} />
                  <View style={styles.routeLine} />
                  <View style={styles.routeDotGreen} />
                </View>
                <View style={styles.routeInfo}>
                  <View style={styles.routeStop}>
                    <Text style={styles.routeLabel}>From</Text>
                    <Text style={styles.routeName}>{shipment.fromBranchName}</Text>
                  </View>
                  <View style={styles.routeStop}>
                    <Text style={styles.routeLabel}>To</Text>
                    <Text style={styles.routeName}>{shipment.toBranchName}</Text>
                  </View>
                </View>
              </View>
            </View>

            {shipment.notes ? (
              <View style={styles.assignedCard}>
                <Ionicons name="document-text-outline" size={16} color={colors.textMuted} />
                <Text style={styles.assignedText}>{shipment.notes}</Text>
              </View>
            ) : null}

            {status !== "ARRIVED" && (
              <TouchableOpacity
                style={styles.updateStatusBtn}
                onPress={() => router.push({ pathname: "/(driver)/update-status", params: { shipmentId: shipment.shipmentId, status } })}
              >
                <Ionicons name="navigate-outline" size={18} color={colors.white} />
                <Text style={styles.updateStatusBtnText}>Update status</Text>
              </TouchableOpacity>
            )}

            {status === "ARRIVED" && (
              <View style={styles.successCard}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                <Text style={styles.successText}>Delivery completed!</Text>
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
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "500" },
  body: { padding: 16 },
  routeCard: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 14 },
  routeRow: { flexDirection: "row", gap: 12 },
  routeIconCol: { alignItems: "center", paddingTop: 4 },
  routeDotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  routeLine: { width: 2, height: 40, backgroundColor: colors.blueTint, marginVertical: 4 },
  routeDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  routeInfo: { flex: 1, gap: 16 },
  routeStop: { gap: 2 },
  routeLabel: { fontSize: 10, color: colors.textMuted },
  routeName: { fontSize: 16, fontWeight: "500", color: colors.textDark },
  assignedCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F5F5F5", borderRadius: 10, padding: 12, marginBottom: 16 },
  assignedText: { fontSize: 13, color: colors.textMuted, flex: 1 },
  updateStatusBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 10 },
  updateStatusBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  successCard: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: colors.successBg, borderRadius: 10, padding: 16, marginBottom: 10 },
  successText: { fontSize: 14, fontWeight: "500", color: colors.success },
});