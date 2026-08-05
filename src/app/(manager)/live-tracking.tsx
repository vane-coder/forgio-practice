import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { getToken } from "../../auth";
import { trackShipment } from "../../services/gps.service";
import { updateShipmentStatus, getShipments } from "../../services/shipment.service";
import { colors } from "../../constants/Colors";

export default function LiveTrackingScreen() {
  const params = useLocalSearchParams<{ shipmentId: string }>();
  const [selectedId, setSelectedId] = useState<string | undefined>(params.shipmentId);
  const [track, setTrack] = useState<any[]>([]);
  const [shipment, setShipment] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const shipmentId = selectedId;

  const load = async () => {
    try {
      const token = await getToken();
      if (token) {
        const shipmentsData = await getShipments(token).catch(() => []);
        const all = Array.isArray(shipmentsData) ? shipmentsData : [];
        setShipments(all);

        if (shipmentId) {
          const gpsData = await trackShipment(token, shipmentId).catch(() => []);
          setTrack(Array.isArray(gpsData) ? gpsData : []);
          const match = all.find((s: any) => s.shipmentId === shipmentId) ?? null;
          setShipment(match);
        } else {
          setTrack([]);
          setShipment(null);
        }
      }
    } catch (e) { console.log("tracking load failed", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { setLoading(true); load(); }, [shipmentId]);

  // Refresh every 10s while a shipment is selected, so the trail moves as the driver does.
  useEffect(() => {
    if (!shipmentId) return;
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [shipmentId]);

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

  const fromName = shipment?.fromBranchName ?? "Origin";
  const toName = shipment?.toBranchName ?? "Destination";
  const status = shipment?.status ?? "IN_TRANSIT";

  const coords = track.map((p) => [parseFloat(p.latitude), parseFloat(p.longitude)]);
  const fallback = [6.2, -0.8]; // rough Ghana-wide fallback if no points yet

  const mapHtml = `
    <!DOCTYPE html><html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>html,body,#map{height:100%;margin:0;padding:0}</style>
    </head><body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const points = ${JSON.stringify(coords)};
        const start = points.length ? points[points.length - 1] : ${JSON.stringify(fallback)};
        const map = L.map('map').setView(start, points.length ? 13 : 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        if (points.length) {
          const line = L.polyline(points, { color: '#1D4ED8', weight: 4 }).addTo(map);
          L.marker(points[points.length - 1]).addTo(map).bindPopup('Current location').openPopup();
          if (points.length > 1) map.fitBounds(line.getBounds(), { padding: [30, 30] });
        }
      </script>
    </body></html>
  `;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={colors.headerSubtitle} />
              <Text style={styles.headerTitle}>Live tracking</Text>
            </TouchableOpacity>
            <Text style={styles.headerSub}>
              {shipmentId ? `Shipment #${shipmentId.substring(0, 8)}` : "No shipment"} · {status.replace("_", " ").toLowerCase()}
            </Text>
          </View>

          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
            ) : !shipmentId ? (
              <View>
                <Text style={styles.pickerHeading}>Select a shipment to track</Text>
                {shipments.length === 0 && (
                  <Text style={{ textAlign: "center", color: colors.textMuted, marginVertical: 30 }}>No shipments available</Text>
                )}
                {shipments.map((s) => {
                  const active = s.status === "IN_TRANSIT" || s.status === "DEPARTED";
                  return (
                    <TouchableOpacity
                      key={s.shipmentId}
                      style={styles.pickerItem}
                      onPress={() => { setLoading(true); setSelectedId(s.shipmentId); }}
                    >
                      <View style={[styles.pickerDot, { backgroundColor: active ? colors.success : colors.textMuted }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pickerRoute}>{s.fromBranchName} → {s.toBranchName}</Text>
                        <Text style={styles.pickerMeta}>
                          #{s.shipmentId.substring(0, 8)} · {String(s.status).replace("_", " ").toLowerCase()}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <>
                <View style={styles.mapContainer}>
                  <WebView originWhitelist={["*"]} source={{ html: mapHtml }} style={styles.map} />
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
                  {marking ? <ActivityIndicator color={colors.white} /> : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                      <Text style={styles.arrivedBtnText}>Mark as arrived</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.refreshBtn} onPress={() => { setLoading(true); load(); }}>
                  <Ionicons name="refresh-outline" size={18} color={colors.primary} />
                  <Text style={styles.refreshBtnText}>Refresh location</Text>
                </TouchableOpacity>

                {!params.shipmentId && (
                  <TouchableOpacity style={styles.changeBtn} onPress={() => setSelectedId(undefined)}>
                    <Ionicons name="list-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.changeBtnText}>Choose another shipment</Text>
                  </TouchableOpacity>
                )}
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
  backRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginLeft: 26 },
  body: { padding: 16 },
  mapContainer: { borderRadius: 12, overflow: "hidden", marginBottom: 14, borderWidth: 0.5, borderColor: colors.border },
  map: { height: 220, width: "100%" },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 12, marginBottom: 14 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  detailLabel: { fontSize: 11, color: colors.textMuted },
  detailValue: { fontSize: 11, fontWeight: "500", color: colors.textDark },
  badgeOrange: { backgroundColor: colors.warningBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeOrangeText: { fontSize: 10, color: colors.warning },
  arrivedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.success, borderRadius: 10, padding: 14, marginBottom: 10 },
  arrivedBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  refreshBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.primary, padding: 14, marginBottom: 10 },
  refreshBtnText: { fontSize: 14, fontWeight: "500", color: colors.primary },
  changeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 10, marginBottom: 20 },
  changeBtnText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
  pickerHeading: { fontSize: 13, fontWeight: "500", color: colors.textMuted, marginBottom: 12 },
  pickerItem: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 10 },
  pickerDot: { width: 9, height: 9, borderRadius: 5 },
  pickerRoute: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  pickerMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});