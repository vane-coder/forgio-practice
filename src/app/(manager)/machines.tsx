import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const machines = [
  { id: 1, name: "Cutting Machine 1", type: "Cutting", status: "RUNNING", lastService: "12 Apr 2026", breakdowns: 1 },
  { id: 2, name: "Sewing Machine 3", type: "Sewing", status: "STOPPED", lastService: "2 Apr 2026", breakdowns: 4 },
  { id: 3, name: "Packaging Unit 2", type: "Packaging", status: "MAINTENANCE", lastService: "1 Apr 2026", breakdowns: 2 },
  { id: 4, name: "Cutting Machine 2", type: "Cutting", status: "RUNNING", lastService: "15 Apr 2026", breakdowns: 0 },
];

const getStatusStyle = (status: string) => {
  if (status === "RUNNING") return { bg: "#E8F5E9", color: "#2E7D32", label: "Running", icon: "checkmark-circle-outline" };
  if (status === "STOPPED") return { bg: "#FFEBEE", color: "#C62828", label: "Stopped", icon: "close-circle-outline" };
  return { bg: "#FFF3E0", color: "#E65100", label: "Maintenance", icon: "construct-outline" };
};

export default function MachinesScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);

  const stoppedCount = machines.filter((m) => m.status === "STOPPED").length;

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
                <Text style={styles.headerTitle}>Machines</Text>
                <Text style={styles.headerSub}>{machines.length} machines · {stoppedCount} stopped</Text>
              </View>
              <TouchableOpacity style={styles.addBtn}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {/* AI suggestion */}
            <View style={styles.aiCard}>
              <Ionicons name="bulb-outline" size={16} color="#E65100" />
              <Text style={styles.aiText}>
                Sewing Machine 3 has broken down 4 times this month. Schedule maintenance before next failure.
              </Text>
            </View>

            {/* Machine cards */}
            {machines.map((machine) => {
              const badge = getStatusStyle(machine.status);
              return (
                <View key={machine.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.machineIcon}>
                      <Ionicons name="settings-outline" size={20} color="#1565C0" />
                    </View>
                    <View style={styles.machineInfo}>
                      <Text style={styles.machineName}>{machine.name}</Text>
                      <Text style={styles.machineType}>{machine.type}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons name="calendar-outline" size={13} color="#888" />
                      <Text style={styles.footerText}>Last service: {machine.lastService}</Text>
                    </View>
                    <View style={styles.footerItem}>
                      <Ionicons name="alert-circle-outline" size={13} color="#888" />
                      <Text style={styles.footerText}>{machine.breakdowns} breakdown{machine.breakdowns !== 1 ? "s" : ""}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => { setSelectedMachine(machine); setShowModal(true); }}
                    >
                      <Ionicons name="swap-horizontal-outline" size={14} color="#1565C0" />
                      <Text style={styles.actionBtnText}>Update status</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="time-outline" size={14} color="#1565C0" />
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
                    onPress={() => setShowModal(false)}
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
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  body: { padding: 16 },
  aiCard: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#FFF8E1", borderRadius: 10, padding: 12, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: "#E65100" },
  aiText: { flex: 1, fontSize: 12, color: "#633806", lineHeight: 17 },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  machineIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  machineInfo: { flex: 1 },
  machineName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  machineType: { fontSize: 11, color: "#888", marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 12 },
  cardFooter: { flexDirection: "row", gap: 16, marginBottom: 12 },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: "#888" },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#E3F2FD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flex: 1, justifyContent: "center" },
  actionBtnText: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#888", marginBottom: 16 },
  statusOption: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, padding: 14, marginBottom: 10 },
  statusOptionText: { fontSize: 14, fontWeight: "500" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 4 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});