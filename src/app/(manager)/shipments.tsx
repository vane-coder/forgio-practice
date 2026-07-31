import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments, createShipment } from "../../services/shipment.service";
import { getBranches } from "../../services/branches.service";
import { colors } from "../../constants/Colors";

const getStatusStyle = (status: string) => {
  if (status === "IN_TRANSIT") return { bg: colors.blueTint, color: colors.primary, label: "In transit" };
  if (status === "ARRIVED") return { bg: colors.successBg, color: colors.success, label: "Arrived" };
  if (status === "DEPARTED") return { bg: colors.warningBg, color: colors.warning, label: "Departed" };
  return { bg: colors.background, color: colors.textMuted, label: "Pending" };
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Shipments</Text>
                <Text style={styles.headerSub}>{shipments.length} total shipments</Text>
              </View>
              <TouchableOpacity style={styles.newBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add" size={18} color={colors.white} />
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

            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}
            {!loading && filtered.length === 0 && (
              <Text style={{ textAlign: "center", color: colors.textMuted, marginVertical: 30 }}>No shipments yet</Text>
            )}

           {!loading && filtered.map((s) => {
              const badge = getStatusStyle(s.status);
              return (
                <View key={s.shipmentId} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.idRow}>
                      <Ionicons name="cube-outline" size={14} color={colors.primary} />
                      <Text style={styles.shipmentId}>#{s.shipmentId.substring(0, 8).toUpperCase()}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>

                  <View style={styles.routeTrack}>
                    <View style={styles.routeCol}>
                      <View style={styles.dotBlue} />
                      <View style={styles.routeConnector} />
                      <View style={styles.dotGreen} />
                    </View>
                    <View style={styles.routeLabels}>
                      <View style={{ marginBottom: 14 }}>
                        <Text style={styles.routeCaption}>From</Text>
                        <Text style={styles.routeText}>{s.fromBranchName}</Text>
                      </View>
                      <View>
                        <Text style={styles.routeCaption}>To</Text>
                        <Text style={styles.routeText}>{s.toBranchName}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="person-circle-outline" size={15} color={colors.textMuted} />
                      <Text style={styles.footerText}>{s.driverName || "Unassigned"}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.footerText}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}</Text>
                    </View>
                  </View>

                  {s.notes ? (
                    <View style={styles.notesBox}>
                      <Ionicons name="document-text-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.notesText}>{s.notes}</Text>
                    </View>
                  ) : null}

                  {s.status === "IN_TRANSIT" && (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() => router.push({ pathname: "/(manager)/live-tracking", params: { shipmentId: s.shipmentId } })}
                    >
                      <Ionicons name="navigate-outline" size={14} color={colors.accent} />
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
                    <Text style={[styles.branchOptionText, fromBranchId === b.branchId && { color: colors.white }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>To branch</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }}>
                {branches.map((b) => (
                  <TouchableOpacity key={b.branchId} style={[styles.branchOption, toBranchId === b.branchId && styles.branchOptionActive]} onPress={() => setToBranchId(b.branchId)}>
                    <Text style={[styles.branchOptionText, toBranchId === b.branchId && { color: colors.white }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Any notes..." placeholderTextColor={colors.textMuted} multiline />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color={colors.white} /> : <Text style={styles.confirmBtnText}>Create shipment</Text>}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  newBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  newBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
  body: { padding: 16 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  filterTab: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  filterTabActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 12, color: colors.textMuted },
  filterTextActive: { color: colors.white, fontWeight: "500" },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  shipmentId: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 ,flexDirection:"row",alignItems:"center",gap:4},
  badgeText: { fontSize: 10, fontWeight: "500" },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  routeStop: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  routeText: { fontSize: 12, color: colors.textDark },
  divider: { height: 0.5, backgroundColor: colors.border, marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: colors.textMuted },
  trackBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: colors.accentLight, borderRadius: 8, padding: 10, marginTop: 10 },
  trackBtnText: { fontSize: 12, color: colors.accent, fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  input: { backgroundColor: colors.background, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 13, color: colors.textDark, marginBottom: 16, minHeight: 60, textAlignVertical: "top" },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 10 },
  confirmBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  cancelBtn: { backgroundColor: colors.background, borderRadius: 10, padding: 14, alignItems: "center" },
  cancelBtnText: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
  branchOption: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4, backgroundColor: colors.background },
  branchOptionActive: { backgroundColor: colors.accent },
  branchOptionText: { fontSize: 13, color: colors.textDark },
  idRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  routeTrack: { flexDirection: "row", gap: 12, marginBottom: 12 },
  routeCol: { alignItems: "center", paddingTop: 4 },
  dotBlue: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
  routeConnector: { width: 2, flex: 1, minHeight: 20, backgroundColor: colors.blueTint, marginVertical: 3 },
  dotGreen: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.success },
  routeLabels: { flex: 1 },
  routeCaption: { fontSize: 10, color: colors.textMuted, marginBottom: 1 },
  notesBox: { flexDirection: "row", alignItems: "flex-start", gap: 6, backgroundColor: colors.background, borderRadius: 8, padding: 10, marginTop: 10 },
  notesText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
