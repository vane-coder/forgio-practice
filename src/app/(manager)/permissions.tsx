import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getWorkersWithPermissions, assignPermission, createWorker } from "../../services/permissions.service";
import { colors } from "../../constants/Colors";

const getRoleBadge = (role: string) => {
  if (role === "DEPT_HEAD") return { bg: colors.blueTint, color: colors.primary, label: "Dept Head" };
  if (role === "MANAGER") return { bg: colors.successBg, color: colors.success, label: "Manager" };
  if (role === "DRIVER") return { bg: colors.warningBg, color: colors.warning, label: "Driver" };
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Permissions</Text>
                <Text style={styles.headerSub}>Manage worker access levels</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                <Ionicons name="person-add-outline" size={16} color={colors.white} />
                <Text style={styles.addBtnText}>Add worker</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color={colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search workers..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} />
            </View>

            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}

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
                          style={[styles.permTag, { backgroundColor: worker[field] ? colors.successBg : colors.dangerBg }]}
                          onPress={() => toggle(worker, field)}
                          disabled={saving === worker.userId}
                        >
                          <Text style={[styles.permTagText, { color: worker[field] ? colors.success : colors.danger }]}>
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
                placeholderTextColor={colors.textMuted}
                value={wName}
                onChangeText={setWName}
              />

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. +233201234567"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={wPhone}
                onChangeText={setWPhone}
              />

              <Text style={styles.inputLabel}>Temporary password</Text>
              <TextInput
                style={styles.input}
                placeholder="Set an initial password"
                placeholderTextColor={colors.textMuted}
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
                  <ActivityIndicator size="small" color={colors.white} />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
  body: { padding: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 15, color: colors.textDark },
  list: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 14 },
  workerItem: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  workerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: "500", color: colors.primary },
  workerInfo: { flex: 1 },
  workerName: { fontSize: 14, fontWeight: "500", color: colors.textDark },
  roleBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { fontSize: 11, fontWeight: "500" },
  permissionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  permTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  permTagText: { fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 4 },
  modalSub: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  inputLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "500", marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textDark },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  roleChip: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  roleChipActive: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  roleChipText: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  roleChipTextActive: { color: colors.accent },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 16 },
  saveBtnText: { fontSize: 14, color: colors.white, fontWeight: "600" },
  cancelBtn: { backgroundColor: colors.background, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 8 },
  cancelBtnText: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
});
