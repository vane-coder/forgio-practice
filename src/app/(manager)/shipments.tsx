import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments, createShipment } from "../../services/shipment.service";
import { getBranches } from "../../services/branches.service";

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

  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const [shipData, branchData] = await Promise.all([
            getShipments(token).catch(() => []),
            getBranches(token).catch(() => []),
          ]);
          setShipments(Array.isArray(shipData) ? shipData : []);
          setBranches(Array.isArray(branchData) ? branchData : []);
        }
      } catch (e) { console.log("shipments load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = shipments.filter((s) => filter === "ALL" || s.status === filter);

  const handleCreate = async () => {
    if (!fromBranchId || !toBranchId) { Alert.alert("Missing", "Select origin and destination branches."); return; }
    if (fromBranchId === toBranchId) { Alert.alert("Invalid", "Origin and destination must differ."); return; }
    setCreating(true);
    try {
      const token = await getToken();
      if (token) {
        const result = await createShipment(token, { fromBranchId, toBranchId, notes: notes.trim() || undefined });
        setShipments((prev) => [result, ...prev]);
        Alert.alert("Created", "Shipment created successfully.");
        setShowModal(false); setFromBranchId(""); setToBranchId(""); setNotes("");
      }
    } catch { Alert.alert("Error", "Failed to create shipment."); }
    finally { setCreating(false); }
  };

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
              <TouchableOpacity style={styles.newBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.newBtnText}>New</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.filterRow}>
              {["ALL", "PENDING", "DEPARTED", "IN_TRANSIT", "ARRIVED"].map((f) => (
                <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
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
                      <Text style={styles.footerText}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}</Text>
                    </View>
                  </View>
                  {s.status === "IN_TRANSIT" && (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() => router.push({ pathname: "/(manager)/live-tracking", params: { shipmentId: s.shipmentId } })}
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

        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>New shipment</Text>
              <Text style={styles.label}>From branch</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }}>
                {branches.map((b) => (
                  <TouchableOpacity key={b.branchId} style={[styles.branchOption, fromBranchId === b.branchId && styles.branchOptionActive]} onPress={() => setFromBranchId(b.branchId)}>
                    <Text style={[styles.branchOptionText, fromBranchId === b.branchId && { color: "#fff" }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>To branch</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }}>
                {branches.map((b) => (
                  <TouchableOpacity key={b.branchId} style={[styles.branchOption, toBranchId === b.branchId && styles.branchOptionActive]} onPress={() => setToBranchId(b.branchId)}>
                    <Text style={[styles.branchOptionText, toBranchId === b.branchId && { color: "#fff" }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Any notes..." placeholderTextColor="#aaa" multiline />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Create shipment</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  input: { backgroundColor: "#F5F7FA", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 13, color: "#1A1A1A", marginBottom: 16, minHeight: 60, textAlignVertical: "top" },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 10 },
  confirmBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center" },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
  branchOption: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4, backgroundColor: "#F5F7FA" },
  branchOptionActive: { backgroundColor: "#1565C0" },
  branchOptionText: { fontSize: 13, color: "#1A1A1A" },
});
