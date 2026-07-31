import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getDepartments, createDepartment } from "../../services/departments.service";
import { colors } from "../../constants/Colors";

const COLORS = [colors.primary, colors.success, colors.warning, "#6A1B9A", "#00838F"];

export default function DepartmentsScreen() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getDepartments(token);
        setDepartments(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.log("departments load failed", e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newDeptName.trim()) return;
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        const dept = await createDepartment(token, { name: newDeptName.trim() });
        setDepartments((prev) => [...prev, dept]);
        setNewDeptName("");
        setShowForm(false);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to create department.");
    } finally { setSaving(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Departments</Text>
            <Text style={styles.headerSub}>
              {departments.length} departments · {departments.reduce((s, d) => s + (d.workerCount || 0), 0)} workers
            </Text>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}

            {!loading && departments.map((dept, i) => (
              <View key={dept.deptId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.colorDot, { backgroundColor: COLORS[i % COLORS.length] }]} />
                  <Text style={styles.deptName}>{dept.name}</Text>
                  <View style={styles.workerBadge}>
                    <Text style={styles.workerBadgeText}>{dept.workerCount ?? 0} workers</Text>
                  </View>
                </View>
                <View style={styles.headRow}>
                  <Ionicons name="person-circle-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.headText}>Head: {dept.headName ?? "Unassigned"}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(manager)/permissions")}>
                    <Ionicons name="people-outline" size={14} color={colors.primary} />
                    <Text style={styles.actionBtnText}>View workers</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {showForm ? (
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>Department name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Quality Control"
                  placeholderTextColor={colors.textMuted}
                  value={newDeptName}
                  onChangeText={setNewDeptName}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={saving}>
                    {saving ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={styles.createBtnText}>Create</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
                <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                <Text style={styles.addBtnText}>Create department</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  deptName: { flex: 1, fontSize: 14, fontWeight: "500", color: colors.textDark },
  workerBadge: { backgroundColor: colors.blueTint, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  workerBadgeText: { fontSize: 10, color: colors.primary, fontWeight: "500" },
  headRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  headText: { fontSize: 11, color: colors.textMuted },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.blueTint, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  actionBtnText: { fontSize: 11, color: colors.primary, fontWeight: "500" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.white, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, borderStyle: "dashed", padding: 14, marginBottom: 20 },
  addBtnText: { fontSize: 13, fontWeight: "500", color: colors.primary },
  formCard: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  formInput: { borderWidth: 0.5, borderColor: colors.border, borderRadius: 8, padding: 10, fontSize: 13, color: colors.textDark, marginBottom: 14 },
  formButtons: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: colors.background, borderRadius: 8, padding: 12, alignItems: "center" },
  cancelBtnText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
  createBtn: { flex: 1, backgroundColor: colors.accent, borderRadius: 8, padding: 12, alignItems: "center" },
  createBtnText: { fontSize: 13, color: colors.white, fontWeight: "500" },
});

