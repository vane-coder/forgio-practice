import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Alert, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getShipments, createShipment, assignShipmentDriver } from "../../services/shipment.service";
import { getBranches } from "../../services/branches.service";
import { getMaterials } from "../../services/materials.service";
import { getWorkersWithPermissions } from "../../services/permissions.service";
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

  const [materials, setMaterials] = useState<any[]>([]);
  const [cargo, setCargo] = useState<{ materialId: string; materialName: string; unit: string; quantity: string }[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [cargoQty, setCargoQty] = useState("");

  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverId, setDriverId] = useState("");

  // assign-driver-to-existing-shipment modal
  const [assignShipment, setAssignShipment] = useState<any | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const [shipData, branchData, materialData, workerData] = await Promise.all([
            getShipments(token).catch(() => []),
            getBranches(token).catch(() => []),
            getMaterials(token).catch(() => []),
            getWorkersWithPermissions(token).catch(() => []),
          ]);
          setShipments(Array.isArray(shipData) ? shipData : []);
          setBranches(Array.isArray(branchData) ? branchData : []);
          setMaterials(Array.isArray(materialData) ? materialData : []);
          setDrivers(Array.isArray(workerData) ? workerData.filter((w: any) => w.role === "DRIVER") : []);
        }
      } catch (e) { console.log("shipments load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = shipments.filter((s) => filter === "ALL" || s.status === filter);

  const addCargoLine = () => {
    if (!selectedMaterialId) { Alert.alert("Missing", "Select a material."); return; }
    const qty = parseFloat(cargoQty);
    if (!qty || qty <= 0) { Alert.alert("Invalid", "Enter a quantity greater than zero."); return; }
    if (cargo.some((c) => c.materialId === selectedMaterialId)) { Alert.alert("Duplicate", "That material is already in the cargo list."); return; }
    const mat = materials.find((m) => m.materialId === selectedMaterialId);
    if (!mat) return;
    setCargo((prev) => [...prev, { materialId: mat.materialId, materialName: mat.name, unit: mat.unit, quantity: cargoQty }]);
    setSelectedMaterialId(""); setCargoQty("");
  };

  const removeCargoLine = (materialId: string) => {
    setCargo((prev) => prev.filter((c) => c.materialId !== materialId));
  };

  const resetForm = () => {
    setFromBranchId(""); setToBranchId(""); setNotes("");
    setCargo([]); setSelectedMaterialId(""); setCargoQty("");
    setDriverId("");
  };

  const handleCreate = async () => {
    if (!fromBranchId || !toBranchId) { Alert.alert("Missing", "Select origin warehouse and destination."); return; }
    if (fromBranchId === toBranchId) { Alert.alert("Invalid", "Warehouse and destination must differ."); return; }
    if (cargo.length === 0) { Alert.alert("Missing", "Add at least one cargo item."); return; }
    setCreating(true);
    try {
      const token = await getToken();
      if (token) {
        const items = cargo.map((c) => ({ materialId: c.materialId, quantity: parseFloat(c.quantity) }));
        const result = await createShipment(token, { fromBranchId, toBranchId, driverId: driverId || undefined, notes: notes.trim() || undefined, items });
        setShipments((prev) => [result, ...prev]);
        Alert.alert("Created", "Shipment created successfully.");
        setShowModal(false); resetForm();
      }
    } catch { Alert.alert("Error", "Failed to create shipment."); }
    finally { setCreating(false); }
  };

  const handleAssignDriver = async (newDriverId: string | null) => {
    if (!assignShipment) return;
    setAssigning(true);
    try {
      const token = await getToken();
      if (token) {
        const updated = await assignShipmentDriver(token, assignShipment.shipmentId, newDriverId);
        setShipments((prev) => prev.map((s) => s.shipmentId === updated.shipmentId ? updated : s));
        setAssignShipment(null);
      }
    } catch { Alert.alert("Error", "Failed to assign driver."); }
    finally { setAssigning(false); }
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
                        <Text style={styles.routeCaption}>Warehouse</Text>
                        <Text style={styles.routeText}>{s.fromBranchName}</Text>
                      </View>
                      <View>
                        <Text style={styles.routeCaption}>Destination</Text>
                        <Text style={styles.routeText}>{s.toBranchName}</Text>
                      </View>
                    </View>
                  </View>

                  {Array.isArray(s.items) && s.items.length > 0 && (
                    <View style={styles.cargoBox}>
                      <Text style={styles.cargoHeading}>Cargo</Text>
                      {s.items.map((it: any, i: number) => (
                        <View key={it.materialId || i} style={styles.cargoLine}>
                          <Ionicons name="cube-outline" size={12} color={colors.textMuted} />
                          <Text style={styles.cargoLineText}>{it.materialName}</Text>
                          <Text style={styles.cargoLineQty}>{it.quantity} {it.unit}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      style={styles.footerItem}
                      disabled={s.status === "ARRIVED"}
                      onPress={() => setAssignShipment(s)}
                    >
                      <Ionicons name="person-circle-outline" size={15} color={colors.textMuted} />
                      <Text style={styles.footerText}>{s.driverName || "Unassigned"}</Text>
                      {s.status !== "ARRIVED" && (
                        <Ionicons name="chevron-forward" size={12} color={colors.accent} />
                      )}
                    </TouchableOpacity>
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
              <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>From warehouse</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }} nestedScrollEnabled>
                {branches.map((b) => (
                  <TouchableOpacity key={b.branchId} style={[styles.branchOption, fromBranchId === b.branchId && styles.branchOptionActive]} onPress={() => setFromBranchId(b.branchId)}>
                    <Text style={[styles.branchOptionText, fromBranchId === b.branchId && { color: colors.white }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>To destination</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }} nestedScrollEnabled>
                {branches.map((b) => (
                  <TouchableOpacity key={b.branchId} style={[styles.branchOption, toBranchId === b.branchId && styles.branchOptionActive]} onPress={() => setToBranchId(b.branchId)}>
                    <Text style={[styles.branchOptionText, toBranchId === b.branchId && { color: colors.white }]}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Driver (optional)</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 12 }} nestedScrollEnabled>
                {drivers.length === 0 && (
                  <Text style={{ fontSize: 12, color: colors.textMuted, paddingVertical: 6 }}>No drivers available</Text>
                )}
                {drivers.map((d) => (
                  <TouchableOpacity key={d.userId} style={[styles.branchOption, driverId === d.userId && styles.branchOptionActive]} onPress={() => setDriverId(driverId === d.userId ? "" : d.userId)}>
                    <Text style={[styles.branchOptionText, driverId === d.userId && { color: colors.white }]}>{d.userName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Cargo</Text>
              <ScrollView style={{ maxHeight: 100, marginBottom: 8 }} nestedScrollEnabled>
                {materials.length === 0 && (
                  <Text style={{ fontSize: 12, color: colors.textMuted, paddingVertical: 6 }}>No materials available</Text>
                )}
                {materials.map((m) => (
                  <TouchableOpacity key={m.materialId} style={[styles.branchOption, selectedMaterialId === m.materialId && styles.branchOptionActive]} onPress={() => setSelectedMaterialId(m.materialId)}>
                    <Text style={[styles.branchOptionText, selectedMaterialId === m.materialId && { color: colors.white }]}>{m.name} ({m.unit})</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.cargoAddRow}>
                <TextInput style={styles.cargoQtyInput} value={cargoQty} onChangeText={setCargoQty} placeholder="Qty" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
                <TouchableOpacity style={styles.addCargoBtn} onPress={addCargoLine}>
                  <Ionicons name="add" size={16} color={colors.white} />
                  <Text style={styles.addCargoBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              {cargo.map((c) => (
                <View key={c.materialId} style={styles.cargoEditLine}>
                  <Text style={styles.cargoEditText}>{c.materialName} — {c.quantity} {c.unit}</Text>
                  <TouchableOpacity onPress={() => removeCargoLine(c.materialId)} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={[styles.label, { marginTop: 12 }]}>Notes (optional)</Text>
              <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Any notes..." placeholderTextColor={colors.textMuted} multiline />
              </ScrollView>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate} disabled={creating}>
                {creating ? <ActivityIndicator color={colors.white} /> : <Text style={styles.confirmBtnText}>Create shipment</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowModal(false); resetForm(); }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Assign-driver-to-existing-shipment modal */}
        <Modal visible={assignShipment !== null} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Assign driver</Text>
              {assignShipment && (
                <Text style={[styles.label, { marginBottom: 12 }]}>
                  Shipment #{assignShipment.shipmentId.substring(0, 8).toUpperCase()}
                </Text>
              )}
              <ScrollView style={{ maxHeight: 260, marginBottom: 12 }} nestedScrollEnabled>
                {drivers.length === 0 && (
                  <Text style={{ fontSize: 12, color: colors.textMuted, paddingVertical: 6 }}>No drivers available</Text>
                )}
                {drivers.map((d) => {
                  const isCurrent = assignShipment?.driverId === d.userId;
                  return (
                    <TouchableOpacity
                      key={d.userId}
                      style={[styles.branchOption, isCurrent && styles.branchOptionActive]}
                      disabled={assigning}
                      onPress={() => handleAssignDriver(d.userId)}
                    >
                      <Text style={[styles.branchOptionText, isCurrent && { color: colors.white }]}>{d.userName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {assignShipment?.driverId && (
                <TouchableOpacity
                  style={styles.unassignBtn}
                  disabled={assigning}
                  onPress={() => handleAssignDriver(null)}
                >
                  <Text style={styles.unassignBtnText}>Unassign driver</Text>
                </TouchableOpacity>
              )}
              {assigning && <ActivityIndicator color={colors.accent} style={{ marginVertical: 8 }} />}
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAssignShipment(null)}>
                <Text style={styles.cancelBtnText}>Close</Text>
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
  unassignBtn: { backgroundColor: colors.dangerBg, borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 8 },
  unassignBtnText: { fontSize: 13, color: colors.danger, fontWeight: "500" },
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
  cargoBox: { backgroundColor: colors.background, borderRadius: 8, padding: 10, marginBottom: 10 },
  cargoHeading: { fontSize: 10, fontWeight: "500", color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  cargoLine: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  cargoLineText: { flex: 1, fontSize: 12, color: colors.textDark },
  cargoLineQty: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  cargoAddRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  cargoQtyInput: { flex: 1, backgroundColor: colors.background, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: colors.textDark },
  addCargoBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 16 },
  addCargoBtnText: { fontSize: 13, color: colors.white, fontWeight: "500" },
  cargoEditLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 },
  cargoEditText: { flex: 1, fontSize: 12, color: colors.textDark },
});
