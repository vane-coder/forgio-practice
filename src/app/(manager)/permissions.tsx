import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getWorkersWithPermissions, assignPermission, createWorker } from "../../services/permissions.service";

const getRoleBadge = (role: string) => {
  if (role === "DEPT_HEAD") return { bg: "#E3F2FD", color: "#0C447C", label: "Dept Head" };
  if (role === "MANAGER") return { bg: "#E8F5E9", color: "#1B5E20", label: "Manager" };
  return { bg: "#F3E5F5", color: "#4A148C", label: "Worker" };
};

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export default function PermissionsScreen() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [wName, setWName] = useState("");
  const [wPhone, setWPhone] = useState("");
  const [wPassword, setWPassword] = useState("");
  const [wRole, setWRole] = useState("WORKER");
  const [creating, setCreating] = useState(false);

  const handleAddWorker = async () => {
    if (!wName.trim() || !wPhone.trim() || !wPassword.trim()) {
      Alert.alert("Missing info", "Name, phone and password are required.");
      return;
    }
    setCreating(true);
    try {
      const token = await getToken();
      if (token) {
        const created = await createWorker(token, {
          name: wName.trim(),
          phone: wPhone.trim(),
          password: wPassword,
          role: wRole,
        });
        setWorkers((prev) => [...prev, created]);
        setWName(""); setWPhone(""); setWPassword(""); setWRole("WORKER");
        setShowAddModal(false);
      }
    } catch (e: any) {
      Alert.alert("Failed", e.message || "Could not add worker.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getWorkersWithPermissions(token);
          setWorkers(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("permissions load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggle = async (worker: any, field: "viewReports" | "enterData" | "admin") => {
    const token = await getToken();
    if (!token) return;
    const updated = { ...worker, [field]: !worker[field] };
    setWorkers((prev) => prev.map((w) => w.userId === worker.userId ? updated : w));
    setSaving(worker.userId);
    try {
      await assignPermission(token, {
        userId: worker.userId,
        viewReports: updated.viewReports,
        enterData: updated.enterData,
        admin: updated.admin,
      });
    } catch (e) {
      setWorkers((prev) => prev.map((w) => w.userId === worker.userId ? worker : w));
      Alert.alert("Error", "Failed to update permissions.");
    } finally { setSaving(null); }
  };

  const filtered = workers.filter((w) => w.userName?.toLowerCase().includes(search.toLowerCase()));

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
                <Text style={styles.headerTitle}>Permissions</Text>
                <Text style={styles.headerSub}>Manage worker access levels</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                <Ionicons name="person-add-outline" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Add worker</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#888" />
              <TextInput style={styles.searchInput} placeholder="Search workers..." placeholderTextColor="#aaa" value={search} onChangeText={setSearch} />
            </View>

            {loading && <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />}

            <View style={styles.list}>
              {filtered.map((worker, index) => {
                const badge = getRoleBadge(worker.role ?? "WORKER");
                return (
                  <View key={worker.userId} style={[styles.workerItem, index === filtered.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.workerRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials(worker.userName ?? "?")}</Text>
                      </View>
                      <View style={styles.workerInfo}>
                        <Text style={styles.workerName}>{worker.userName}</Text>
                      </View>
                      <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.roleBadgeText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>
                    <View style={styles.permissionRow}>
                      {(["viewReports", "enterData", "admin"] as const).map((field) => (
                        <TouchableOpacity
                          key={field}
                          style={[styles.permTag, { backgroundColor: worker[field] ? "#E8F5E9" : "#FFEBEE" }]}
                          onPress={() => toggle(worker, field)}
                          disabled={saving === worker.userId}
                        >
                          <Text style={[styles.permTagText, { color: worker[field] ? "#1B5E20" : "#B71C1C" }]}>
                            {field === "viewReports" ? (worker[field] ? "View reports" : "No reports") :
                             field === "enterData" ? (worker[field] ? "Enter data" : "No data entry") :
                             (worker[field] ? "Admin" : "No admin")}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Add worker modal */}
        <Modal visible={showAddModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add worker</Text>
              <Text style={styles.modalSub}>Create a new account in your factory</Text>

              <Text style={styles.inputLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kwame Mensah"
                placeholderTextColor="#999"
                value={wName}
                onChangeText={setWName}
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. +233201234567"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={wPhone}
                onChangeText={setWPhone}
              />

              <Text style={styles.inputLabel}>Temporary password</Text>
              <TextInput
                style={styles.input}
                placeholder="Set an initial password"
                placeholderTextColor="#999"
                secureTextEntry
                value={wPassword}
                onChangeText={setWPassword}
              />

              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleRow}>
                {["WORKER", "DEPT_HEAD", "DRIVER"].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, wRole === r && styles.roleChipActive]}
                    onPress={() => setWRole(r)}
                  >
                    <Text style={[styles.roleChipText, wRole === r && styles.roleChipTextActive]}>
                      {r === "DEPT_HEAD" ? "Dept Head" : r === "DRIVER" ? "Driver" : "Worker"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, creating && { opacity: 0.6 }]}
                onPress={handleAddWorker}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Add worker</Text>
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  body: { padding: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", paddingHorizontal: 12, paddingVertical: 5, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 15, color: "#1A1A1A" },
  list: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 14 },
  workerItem: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  workerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center", flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: "500", color: "#0C447C" },
  workerInfo: { flex: 1 },
  workerName: { fontSize: 14, fontWeight: "500", color: "#1A1A1A" },
  roleBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { fontSize: 11, fontWeight: "500" },
  permissionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  permTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  permTagText: { fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: "#1A1A1A", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#888", marginBottom: 12 },
  inputLabel: { fontSize: 12, color: "#555", fontWeight: "500", marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: "#1A1A1A" },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  roleChip: { flex: 1, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  roleChipActive: { backgroundColor: "#E3F2FD", borderColor: "#1565C0" },
  roleChipText: { fontSize: 12, color: "#888", fontWeight: "500" },
  roleChipTextActive: { color: "#1565C0" },
  saveBtn: { backgroundColor: "#1565C0", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 16 },
  saveBtnText: { fontSize: 14, color: "#fff", fontWeight: "600" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 8 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});
