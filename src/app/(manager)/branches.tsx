import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getBranches, createBranch } from "../../services/branches.service";

export default function BranchesScreen() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const loadBranches = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getBranches(token);
        setBranches(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.log("branches load failed", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadBranches(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) {
      Alert.alert("Missing name", "Please enter a branch name.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await createBranch(token, { name: newName, location: newLocation });
        setShowModal(false);
        setNewName(""); setNewLocation("");
        setLoading(true);
        await loadBranches();
      }
    } catch (e) {
      Alert.alert("Failed", "Could not create branch.");
    } finally { setSaving(false); }
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
                <Text style={styles.headerTitle}>Branches</Text>
                <Text style={styles.headerSub}>{branches.length} locations</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {loading && <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />}
            {!loading && branches.length === 0 && (
              <Text style={{ textAlign: "center", color: "#888", marginVertical: 30 }}>
                No branches yet. Add your first one.
              </Text>
            )}

            {!loading && branches.map((branch) => (
              <View key={branch.branchId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="business-outline" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.cardTopInfo}>
                    <Text style={styles.branchName}>{branch.name}</Text>
                    <Text style={styles.branchAddress}>{branch.location || "No location set"}</Text>
                  </View>
                  <View style={[
                    styles.tag,
                    branch.isMain ? { backgroundColor: "#E8F5E9" } : { backgroundColor: "#E3F2FD" }
                  ]}>
                    <Text style={[
                      styles.tagText,
                      branch.isMain ? { color: "#1B5E20" } : { color: "#0C447C" }
                    ]}>
                      {branch.isMain ? "Main" : "Branch"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="people-outline" size={14} color="#888" />
                    <Text style={styles.statText}>{branch.workerCount} workers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="construct-outline" size={14} color="#888" />
                    <Text style={styles.statText}>{branch.machineCount} machines</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push({
                      pathname: "/(manager)/branch-details",
                      params: {
                        branchId: branch.branchId,
                        name: branch.name,
                        location: branch.location || "",
                        workerCount: String(branch.workerCount ?? 0),
                        machineCount: String(branch.machineCount ?? 0),
                        isMain: branch.isMain ? "1" : "0",
                      },
                    })}
                  >
                    <Ionicons name="eye-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>View details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push("/(manager)/shipments")}
                  >
                    <Ionicons name="swap-horizontal-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>Shipments</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          </View>
        </ScrollView>

        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add new branch</Text>

              <Text style={styles.modalLabel}>Branch name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Accra Branch"
                placeholderTextColor="#aaa"
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.modalLabel}>Location</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Tema Industrial Area"
                placeholderTextColor="#aaa"
                value={newLocation}
                onChangeText={setNewLocation}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={handleAdd} disabled={saving}>
                  <Text style={styles.modalSaveText}>{saving ? "Adding..." : "Add branch"}</Text>
                </TouchableOpacity>
              </View>
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
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  cardTopInfo: { flex: 1 },
  branchName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  branchAddress: { fontSize: 11, color: "#888", marginTop: 2 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 12 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 11, color: "#888" },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: "#E3F2FD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flex: 1 },
  actionBtnText: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 16 },
  modalLabel: { fontSize: 12, fontWeight: "500", color: "#1A1A1A", marginBottom: 6 },
  modalInput: { backgroundColor: "#F5F7FA", borderRadius: 8, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 11, fontSize: 13, color: "#1A1A1A", marginBottom: 14 },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 6 },
  modalCancel: { flex: 1, backgroundColor: "#F5F5F5", borderRadius: 8, padding: 13, alignItems: "center" },
  modalCancelText: { fontSize: 14, color: "#888", fontWeight: "500" },
  modalSave: { flex: 1, backgroundColor: "#1565C0", borderRadius: 8, padding: 13, alignItems: "center" },
  modalSaveText: { fontSize: 14, color: "#fff", fontWeight: "500" },
});