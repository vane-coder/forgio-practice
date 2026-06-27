import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { router } from "expo-router";

const shipment = {
  id: "SH-0042",
  from: "Kumasi HQ",
  to: "Accra Branch",
  status: "IN_TRANSIT",
  departedAt: "9:00 AM",
  eta: "11:30 AM",
  items: "Cotton 200kg · 500 shirts",
  driver: {
    name: "Kofi Owusu",
    initials: "KO",
    plate: "GR-1234-21",
  },
};

const routeCoordinates = [
  { latitude: 6.6885, longitude: -1.6244 },
  { latitude: 6.5, longitude: -1.2 },
  { latitude: 6.2, longitude: -0.8 },
  { latitude: 5.9, longitude: -0.4 },
  { latitude: 5.6037, longitude: -0.1870 },
];

const currentPosition = { latitude: 6.2, longitude: -0.8 };

export default function LiveTrackingScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#90CAF9" />
              <Text style={styles.headerTitle}>Live tracking</Text>
            </TouchableOpacity>
            <Text style={styles.headerSub}>Shipment #{shipment.id} · In transit</Text>
          </View>

          <View style={styles.body}>

            {/* MAP */}
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 6.2,
                  longitude: -0.8,
                  latitudeDelta: 2.5,
                  longitudeDelta: 2.5,
                }}
              >
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#1565C0"
                  strokeWidth={3}
                />
                <Marker coordinate={routeCoordinates[0]} title="Kumasi HQ" pinColor="#1565C0" />
                <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Accra Branch" pinColor="#2E7D32" />
                <Marker coordinate={currentPosition} title="Driver location" pinColor="#E65100" />
              </MapView>
            </View>

            {/* PROGRESS BAR */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Departed {shipment.departedAt}</Text>
                <Text style={styles.progressLabel}>ETA {shipment.eta}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
                <View style={styles.progressDot} />
              </View>
              <View style={styles.progressStops}>
                <Text style={styles.stopActive}>{shipment.from}</Text>
                <Text style={styles.stopActive}>En route</Text>
                <Text style={styles.stopInactive}>{shipment.to}</Text>
              </View>
            </View>

            {/* DRIVER CARD */}
            <View style={styles.driverCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{shipment.driver.initials}</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{shipment.driver.name}</Text>
                <Text style={styles.driverRole}>Driver · {shipment.driver.plate}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call-outline" size={16} color="#1565C0" />
              </TouchableOpacity>
            </View>

            {/* SHIPMENT DETAILS */}
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>From</Text>
                <Text style={styles.detailValue}>{shipment.from}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>To</Text>
                <Text style={styles.detailValue}>{shipment.to}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.badgeOrange}>
                  <Text style={styles.badgeOrangeText}>In transit</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ETA</Text>
                <Text style={styles.detailValue}>~45 mins</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Items</Text>
                <Text style={styles.detailValue}>{shipment.items}</Text>
              </View>
            </View>

            {/* BUTTONS */}
            <TouchableOpacity
              style={styles.arrivedBtn}
              onPress={() => router.push("/(manager)/shipments")}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.arrivedBtnText}>Mark as arrived</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.refreshBtn}>
              <Ionicons name="refresh-outline" size={18} color="#1565C0" />
              <Text style={styles.refreshBtnText}>Refresh location</Text>
            </TouchableOpacity>

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
  progressContainer: { marginBottom: 14 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { fontSize: 11, color: "#888" },
  progressTrack: { height: 4, backgroundColor: "#E3F2FD", borderRadius: 4, position: "relative" },
  progressFill: { height: 4, backgroundColor: "#1565C0", borderRadius: 4, width: "55%" },
  progressDot: { width: 12, height: 12, backgroundColor: "#1565C0", borderRadius: 6, position: "absolute", top: -4, left: "55%", marginLeft: -6, borderWidth: 2, borderColor: "#F5F7FA" },
  progressStops: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  stopActive: { fontSize: 10, color: "#1565C0", fontWeight: "500" },
  stopInactive: { fontSize: 10, color: "#888" },
  driverCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 12, fontWeight: "500", color: "#0C447C" },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  driverRole: { fontSize: 10, color: "#888", marginTop: 2 },
  callBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
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