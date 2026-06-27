import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const shipment = {
  id: "SH-0042",
  from: "Kumasi HQ",
  fromAddress: "Adum, Kumasi",
  to: "Accra Branch",
  toAddress: "Tema Industrial Area, Accra",
  items: [
    { name: "Cotton Fabric", quantity: "200kg" },
    { name: "Finished Shirts", quantity: "500 units" },
  ],
  manager: "Raina Pryce",
  assignedAt: "8:30 AM",
};

export default function ShipmentAssignmentScreen() {
  const [status, setStatus] = useState("PENDING");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>My Shipment</Text>
                <Text style={styles.headerSub}>Shipment #{shipment.id}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                status === "PENDING" && { backgroundColor: "#FFF3E0" },
                status === "IN_TRANSIT" && { backgroundColor: "#E3F2FD" },
                status === "ARRIVED" && { backgroundColor: "#E8F5E9" },
              ]}>
                <Text style={[
                  styles.statusText,
                  status === "PENDING" && { color: "#E65100" },
                  status === "IN_TRANSIT" && { color: "#0C447C" },
                  status === "ARRIVED" && { color: "#1B5E20" },
                ]}>
                  {status === "PENDING" ? "Pending" : status === "IN_TRANSIT" ? "In transit" : "Arrived"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            {/* Route card */}
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
                    <Text style={styles.routeName}>{shipment.from}</Text>
                    <Text style={styles.routeAddress}>{shipment.fromAddress}</Text>
                  </View>
                  <View style={styles.routeStop}>
                    <Text style={styles.routeLabel}>To</Text>
                    <Text style={styles.routeName}>{shipment.to}</Text>
                    <Text style={styles.routeAddress}>{shipment.toAddress}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Items */}
            <Text style={styles.sectionTitle}>Items in shipment</Text>
            <View style={styles.card}>
              {shipment.items.map((item, i) => (
                <View key={i} style={[
                  styles.itemRow,
                  i === shipment.items.length - 1 && { borderBottomWidth: 0 }
                ]}>
                  <View style={styles.itemIcon}>
                    <Ionicons name="cube-outline" size={16} color="#1565C0" />
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>{item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Assigned by */}
            <View style={styles.assignedCard}>
              <Ionicons name="person-circle-outline" size={16} color="#888" />
              <Text style={styles.assignedText}>
                Assigned by <Text style={{ color: "#1565C0", fontWeight: "500" }}>{shipment.manager}</Text> at {shipment.assignedAt}
              </Text>
            </View>

            {/* Buttons */}
            {status === "PENDING" && (
              <TouchableOpacity style={styles.departBtn} onPress={() => setStatus("IN_TRANSIT")}>
                <Ionicons name="car-outline" size={18} color="#fff" />
                <Text style={styles.departBtnText}>Start delivery</Text>
              </TouchableOpacity>
            )}

            {status === "IN_TRANSIT" && (
              <TouchableOpacity
                style={styles.updateStatusBtn}
                onPress={() => router.push("/(driver)/update-status")}
              >
                <Ionicons name="navigate-outline" size={18} color="#1565C0" />
                <Text style={styles.updateStatusBtnText}>Update status</Text>
              </TouchableOpacity>
            )}

            {status === "IN_TRANSIT" && (
              <TouchableOpacity style={styles.arrivedBtn} onPress={() => setStatus("ARRIVED")}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.arrivedBtnText}>Mark as arrived</Text>
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
  body: { padding: 10 },
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
  routeAddress: { fontSize: 10, color: "#888" },
  sectionTitle: { fontSize: 14, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  itemIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  itemName: { flex: 1, fontSize: 14, color: "#1A1A1A" },
  itemQty: { fontSize: 12, fontWeight: "500", color: "#1565C0" },
  assignedCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F5F5F5", borderRadius: 10, padding: 12, marginBottom: 16 },
  assignedText: { fontSize: 14, color: "#888" },
  departBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  departBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  updateStatusBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 14, marginBottom: 10 },
  updateStatusBtnText: { fontSize: 14, fontWeight: "500", color: "#1565C0" },
  arrivedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#2E7D32", borderRadius: 10, padding: 14, marginBottom: 10 },
  arrivedBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  successCard: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#E8F5E9", borderRadius: 10, padding: 16, marginBottom: 10 },
  successText: { fontSize: 14, fontWeight: "500", color: "#2E7D32" },
});