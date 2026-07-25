import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { router, useLocalSearchParams } from "expo-router";
import { getToken } from "../../auth";
import { trackShipment } from "../../services/gps.service";
import { updateShipmentStatus, getShipments } from "../../services/shipment.service";

export default function LiveTrackingScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const [tracking, setTracking] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = async () => {
    if (!shipmentId) { setLoading(false); return; }
    try {
      const token = await getToken();
      if (token) {
        const [gpsData, shipmentsData] = await Promise.all([
          trackShipment(token, shipmentId).catch(() => []),
          getShipments(token).catch(() => []),
        ]);
        const logs = Array.isArray(gpsData) ? gpsData : [];
        setTracking(logs.length > 0 ? logs[logs.length - 1] : null);
        const match = Array.isArray(shipmentsData) ? shipmentsData.find((s: any) => s.shipmentId === shipmentId) : null;
        setShipment(match);
      }
    } catch (e) { console.log("tracking load failed", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [shipmentId]);

  const handleMarkArrived = async () => {
    if (!shipmentId) return;
    setMarking(true);
    try {
      const token = await getToken();
      if (token) {
        await updateShipmentStatus(token, shipmentId, "ARRIVED");
        Alert.alert("Updated", "Shipment marked as arrived.");
        router.push("/(manager)/shipments");
      }
    } catch { Alert.alert("Error", "Failed to update shipment status."); }
    finally { setMarking(false); }
  };

  const currentLat = tracking?.latitude ? parseFloat(tracking.latitude) : 6.2;
  const currentLng = tracking?.longitude ? parseFloat(tracking.longitude) : -0.8;
  const fromName = shipment?.fromBranchName ?? "Origin";
  const toName = shipment?.toBranchName ?? "Destination";
  const status = shipment?.status ?? "IN_TRANSIT";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#90CAF9" />
              <Text style={styles.headerTitle}>Live tracking</Text>
            </TouchableOpacity>
            <Text style={styles.headerSub}>
              {shipmentId ? `Shipment #${shipmentId.substring(0, 8)}` : "No shipment"} · {status.replace("_", " ").toLowerCase()}
            </Text>
          </View>

          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 40 }} />
            ) : (
              <>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{ latitude: currentLat, longitude: currentLng, latitudeDelta: 2.5, longitudeDelta: 2.5 }}
                  >
                    <Marker coordinate={{ latitude: currentLat, longitude: currentLng }} title="Current location" pinColor="#E65100" />
                  </MapView>
                </View>

                <View style={styles.card}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>From</Text>
                    <Text style={styles.detailValue}>{fromName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>To</Text>
                    <Text style={styles.detailValue}>{toName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.badgeOrange}>
                      <Text style={styles.badgeOrangeText}>{status.replace("_", " ")}</Text>
                    </View>
                  </View>
                  {shipment?.driverName && (
                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                      <Text style={styles.detailLabel}>Driver</Text>
                      <Text style={styles.detailValue}>{shipment.driverName}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity style={styles.arrivedBtn} onPress={handleMarkArrived} disabled={marking}>
                  {marking ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      <Text style={styles.arrivedBtnText}>Mark as arrived</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.refreshBtn} onPress={() => { setLoading(true); load(); }}>
                  <Ionicons name="refresh-outline" size={18} color="#1565C0" />
                  <Text style={styles.refreshBtnText}>Refresh location</Text>
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginLeft: 26 },
  body: { padding: 16 },
  mapContainer: { borderRadius: 12, overflow: "hidden", marginBottom: 14, borderWidth: 0.5, borderColor: "#e0e0e0" },
  map: { height: 220, width: "100%" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, marginBottom: 14 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  detailLabel: { fontSize: 11, color: "#888" },
  detailValue: { fontSize: 11, fontWeight: "500", color: "#1A1A1A" },
  badgeOrange: { backgroundColor: "#FFF3E0", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeOrangeText: { fontSize: 10, color: "#854F0B" },
  arrivedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#2E7D32", borderRadius: 10, padding: 14, marginBottom: 10 },
  arrivedBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  refreshBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#1565C0", padding: 14, marginBottom: 20 },
  refreshBtnText: { fontSize: 14, fontWeight: "500", color: "#1565C0" },
});
