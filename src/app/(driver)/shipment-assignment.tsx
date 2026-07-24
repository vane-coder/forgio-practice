import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments } from "../../services/shipment.service";
import { API_BASE_URL } from "../../services/api.config";

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

      const all = await getShipments(token);
      const mine = Array.isArray(all)
        ? all.find((s: any) => s.driverId === profile?.userId && s.status !== "ARRIVED")
        : null;
      setShipment(mine || null);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0", justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Shipment</Text>
          </View>
          <View style={[styles.body, { alignItems: "center", paddingTop: 60 }]}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={{ color: "#888", marginTop: 12 }}>No active shipment assigned right now.</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const status = shipment.status;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>My Shipment</Text>
                <Text style={styles.headerSub}>#{shipment.shipmentId.substring(0, 8)}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                status === "PENDING" && { backgroundColor: "#FFF3E0" },
                status === "DEPARTED" && { backgroundColor: "#F3E5F5" },
                status === "IN_TRANSIT" && { backgroundColor: "#E3F2FD" },
                status === "ARRIVED" && { backgroundColor: "#E8F5E9" },
              ]}>
                <Text style={[
                  styles.statusText,
                  status === "PENDING" && { color: "#E65100" },
                  status === "DEPARTED" && { color: "#6A1B9A" },
                  status === "IN_TRANSIT" && { color: "#0C447C" },
                  status === "ARRIVED" && { color: "#1B5E20" },
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
                <Ionicons name="document-text-outline" size={16} color="#888" />
                <Text style={styles.assignedText}>{shipment.notes}</Text>
              </View>
            ) : null}

            {status !== "ARRIVED" && (
              <TouchableOpacity
                style={styles.updateStatusBtn}
                onPress={() => router.push({ pathname: "/(driver)/update-status", params: { shipmentId: shipment.shipmentId, status } })}
              >
                <Ionicons name="navigate-outline" size={18} color="#1565C0" />
                <Text style={styles.updateStatusBtnText}>Update status</Text>
              </TouchableOpacity>
            )}

            {status === "ARRIVED" && (
              <View style={styles.successCard}>
                <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "500" },
  body: { padding: 16 },
  routeCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 14 },
  routeRow: { flexDirection: "row", gap: 12 },
  routeIconCol: { alignItems: "center", paddingTop: 4 },
  routeDotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#1565C0" },
  routeLine: { width: 2, height: 40, backgroundColor: "#E3F2FD", marginVertical: 4 },
  routeDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2E7D32" },
  routeInfo: { flex: 1, gap: 16 },
  routeStop: { gap: 2 },
  routeLabel: { fontSize: 10, color: "#888" },
  routeName: { fontSize: 16, fontWeight: "500", color: "#1A1A1A" },
  assignedCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F5F5F5", borderRadius: 10, padding: 12, marginBottom: 16 },
  assignedText: { fontSize: 13, color: "#888", flex: 1 },
  updateStatusBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 14, marginBottom: 10 },
  updateStatusBtnText: { fontSize: 14, fontWeight: "500", color: "#1565C0" },
  successCard: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#E8F5E9", borderRadius: 10, padding: 16, marginBottom: 10 },
  successText: { fontSize: 14, fontWeight: "500", color: "#2E7D32" },
});