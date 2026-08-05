import React, { useState ,useCallback} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect} from "expo-router";
import { ActivityIndicator } from "react-native";
import { getToken } from "../../auth";
import { getMachines, updateMachineStatus, createMachine } from "../../services/machines.service";
import { colors } from "../../constants/Colors";

const getStatusStyle = (status: string) => {
  if (status === "RUNNING") return { bg: colors.successBg, color: colors.success, label: "Running", icon: "checkmark-circle-outline" };
  if (status === "STOPPED") return { bg: colors.dangerBg, color: colors.danger, label: "Stopped", icon: "close-circle-outline" };
  return { bg: colors.warningBg, color: colors.warning, label: "Maintenance", icon: "construct-outline" };
};

export default function MachinesScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newServiceDate, setNewServiceDate] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateMachine = async () => {
    if (!newName.trim()) {
      Alert.alert("Missing name", "Please enter a machine name.");
      return;
    }
    setCreating(true);
    try {
      const token = await getToken();
      if (token) {
        const created = await createMachine(token, {
          name: newName.trim(),
          lastServiceDate: newServiceDate.trim() || undefined,
        });
        setMachines((prev) => [...prev, created]);
        setNewName("");
        setNewServiceDate("");
        setShowAddModal(false);
      }
    } catch (e: any) {
      Alert.alert("Failed", e.message || "Could not add machine.");
    } finally {
      setCreating(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMachines(token);
          setMachines(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("machines load failed", e); }
      finally { setLoading(false); }
    })();
  }, []));

  const stoppedCount = machines.filter((m) => m.status === "STOPPED").length;

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
                <Text style={styles.headerTitle}>Machines</Text>
                <Text style={styles.headerSub}>{machines.length} machines · {stoppedCount} stopped</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                <Ionicons name="add" size={18} color={colors.white} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {/* Machine cards */}
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}
            {!loading && machines.length === 0 && (
              <Text style={{ textAlign: "center", color: colors.textMuted, marginVertical: 30 }}>No machines yet</Text>
            )}
            {!loading && machines.map((machine) => {
              const badge = getStatusStyle(machine.status);
              return (
                <View key={machine.machineId} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.machineIcon}>
                      <Ionicons name="settings-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.machineInfo}>
                      <Text style={styles.machineName}>{machine.name}</Text>
                      <Text style={styles.machineType}>Machine</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.footerText}>Last service: {machine.lastServiceDate || "N/A"}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="alert-circle-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.footerText}>{machine.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => { setSelectedMachine(machine); setShowModal(true); }}
                    >
                      <Ionicons name="swap-horizontal-outline" size={14} color={colors.primary} />
                      <Text style={styles.actionBtnText}>Update status</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => router.push({ pathname: "/(manager)/machine-history" as any, params: { machineId: machine.machineId, machineName: machine.name } })}
                    >
                      <Ionicons name="time-outline" size={14} color={colors.primary} />
                      <Text style={styles.actionBtnText}>View history</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

          </View>
        </ScrollView>

        {/* Status update modal */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Update status</Text>
              {selectedMachine && (
                <Text style={styles.modalSub}>{selectedMachine.name}</Text>
              )}
              {["RUNNING", "STOPPED", "MAINTENANCE"].map((s) => {
                const st = getStatusStyle(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusOption, { backgroundColor: st.bg }]}
                    onPress={async () => {
                      if (!selectedMachine) return;
                      setUpdatingStatus(true);
                      try {
                        const token = await getToken();
                        if (token) {
                          await updateMachineStatus(token, selectedMachine.machineId, s);
                          setMachines((prev) => prev.map((m) => m.machineId === selectedMachine.machineId ? { ...m, status: s } : m));
                        }
                      } catch (e) { console.log("status update failed", e); }
                      finally { setUpdatingStatus(false); setShowModal(false); }
                    }}
                  >
                    <Ionicons name={st.icon as any} size={18} color={st.color} />
                    <Text style={[styles.statusOptionText, { color: st.color }]}>{st.label}</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add machine modal */}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add machine</Text>
              <Text style={styles.modalSub}>Enter machine details</Text>

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sewing Machine 4"
                placeholderTextColor={colors.textMuted}
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.inputLabel}>Last service date (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                value={newServiceDate}
                onChangeText={setNewServiceDate}
              />

              <TouchableOpacity
                style={[styles.saveBtn, creating && { opacity: 0.6 }]}
                onPress={handleCreateMachine}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
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
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
  body: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  machineIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  machineInfo: { flex: 1 },
  machineName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  machineType: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 12 },
  cardFooter: { flexDirection: "row", gap: 16, marginBottom: 12 },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: colors.textMuted },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.blueTint, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flex: 1, justifyContent: "center" },
  actionBtnText: { fontSize: 11, color: colors.primary, fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 4 },
  modalSub: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  statusOption: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, padding: 14, marginBottom: 10 },
  statusOptionText: { fontSize: 14, fontWeight: "500" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 4 },
  cancelBtnText: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
  inputLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "500", marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark, marginBottom: 4 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 12 },
  saveBtnText: { fontSize: 14, color: colors.white, fontWeight: "600" },
});