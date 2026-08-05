import React, { useState, useCallback} from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router ,useFocusEffect} from "expo-router";
import { getToken } from "../../auth";
import { getMaterials, addMaterial } from "../../services/materials.service";
import { getDepartments } from "../../services/departments.service";
import { colors } from "../../constants/Colors";

const getStatusStyle = (lowStock: boolean) => {
  if (lowStock) return { bg: colors.dangerBg, color: colors.danger, label: "Low" };
  return { bg: colors.successBg, color: colors.success, label: "OK" };
};

const getProgressWidth = (stock: number, reorder: number) => {
  const denom = reorder > 0 ? reorder * 2 : 100;
  const pct = Math.min((stock / denom) * 100, 100);
  return `${pct}%`  as `${number}%`;
};

export default function MaterialsScreen() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newDeptId, setNewDeptId] = useState<string | null>(null);

  const [departments, setDepartments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMaterials = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getMaterials(token);
        setMaterials(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.log("Failed to load materials", e);
    } finally {
      setLoading(false);
    }
  };
useFocusEffect(
  useCallback(() => {
    loadMaterials();
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const depts = await getDepartments(token);
          setDepartments(Array.isArray(depts) ? depts : []);
        }
      } catch (e) {
        console.log("Failed to load departments", e);
      }
    })();
  }, [])
);

  const handleAdd = async () => {
    if (!newName || !newUnit || !newStock) {
      Alert.alert("Missing fields", "Please fill in name, unit and stock.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await addMaterial(token, {
          name: newName,
          unit: newUnit,
          quantityInStock: Number(newStock),
          reorderLevel: 0,
          costPerUnit: Number(newCost) || 0,
          departmentId: newDeptId,
        } as any);
        setShowModal(false);
        setNewName(""); setNewUnit(""); setNewStock(""); setNewCost(""); setNewDeptId(null);
        setLoading(true);
        await loadMaterials();
      }
    } catch (e) {
      Alert.alert("Failed", "Could not add material.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = materials.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const lowCount = materials.filter((m) => m.lowStock).length;

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
                <Text style={styles.headerTitle}>Raw Materials</Text>
                <Text style={styles.headerSub}>{materials.length} items · {lowCount} low stock</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add" size={18} color={colors.white} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>

            {lowCount > 0 && (
              <View style={styles.alertCard}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
                <Text style={styles.alertText}>
                  {lowCount} material{lowCount > 1 ? "s are" : " is"} below reorder level. Order soon.
                </Text>
              </View>
            )}

            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search materials..."
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {loading && (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}

            {!loading && (
              <View style={styles.list}>
                {filtered.map((mat, i) => {
                  const badge = getStatusStyle(mat.lowStock);
                  return (
                    <View
                      key={mat.materialId}
                      style={[styles.item, i === filtered.length - 1 && { borderBottomWidth: 0 }]}
                    >
                      <View style={styles.itemTop}>
                        <View style={styles.itemIcon}>
                          <Ionicons name="cube-outline" size={18} color={colors.primary} />
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{mat.name}</Text>
                          <Text style={styles.itemStock}>
                            {mat.quantityInStock}{mat.unit} remaining · GHS {mat.costPerUnit}/{mat.unit}
                          </Text>
                          <Text style={styles.itemDept}>{mat.departmentName || "All departments"}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                        </View>
                      </View>

                      <View style={styles.progressTrack}>
                        <View style={[
                          styles.progressFill,
                          {
                            width: getProgressWidth(mat.quantityInStock, mat.reorderLevel),
                            backgroundColor: mat.lowStock ? colors.danger : colors.success
                          }
                        ]} />
                      </View>
                      <Text style={styles.reorderText}>
                        Reorder at {mat.reorderLevel}{mat.unit}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {!loading && filtered.length === 0 && (
              <View style={{ paddingVertical: 30, alignItems: "center" }}>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>No materials yet. Add your first one.</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.marketplaceBtn}
              onPress={() => router.push("/(manager)/marketplace")}
            >
              <Ionicons name="cart-outline" size={18} color={colors.accent} />
              <Text style={styles.marketplaceBtnText}>Buy from marketplace</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add new material</Text>

              <Text style={styles.modalLabel}>Name</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. Cotton Fabric" placeholderTextColor={colors.textMuted} value={newName} onChangeText={setNewName} />

              <Text style={styles.modalLabel}>Unit</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. kg, L, units" placeholderTextColor={colors.textMuted} value={newUnit} onChangeText={setNewUnit} />

              <Text style={styles.modalLabel}>Current stock</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. 100" placeholderTextColor={colors.textMuted} value={newStock} onChangeText={setNewStock} keyboardType="numeric" />

              <Text style={styles.modalLabel}>Cost per unit (GHS)</Text>
              <TextInput style={styles.modalInput} placeholder="e.g. 12" placeholderTextColor={colors.textMuted} value={newCost} onChangeText={setNewCost} keyboardType="numeric" />

              <Text style={styles.modalLabel}>Department</Text>
              <Text style={styles.modalHint}>Leave as "All departments" to share this material factory-wide.</Text>
              <View style={styles.deptChips}>
                <TouchableOpacity
                  style={[styles.deptChip, newDeptId === null && styles.deptChipActive]}
                  onPress={() => setNewDeptId(null)}
                >
                  <Text style={[styles.deptChipText, newDeptId === null && styles.deptChipTextActive]}>All departments</Text>
                </TouchableOpacity>
                {departments.map((d) => (
                  <TouchableOpacity
                    key={d.deptId}
                    style={[styles.deptChip, newDeptId === d.deptId && styles.deptChipActive]}
                    onPress={() => setNewDeptId(d.deptId)}
                  >
                    <Text style={[styles.deptChipText, newDeptId === d.deptId && styles.deptChipTextActive]}>{d.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={handleAdd} disabled={saving}>
                  <Text style={styles.modalSaveText}>{saving ? "Adding..." : "Add material"}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
  body: { padding: 16 },
  alertCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.dangerBg, borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: colors.danger },
  alertText: { flex: 1, fontSize: 12, color: colors.danger, lineHeight: 17 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 13, color: colors.textDark },
  list: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 14 },
  item: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  itemTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  itemStock: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  itemDept: { fontSize: 9, color: colors.accent, marginTop: 2, fontWeight: "500" },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 4, marginBottom: 4 },
  progressFill: { height: 4, borderRadius: 4 },
  reorderText: { fontSize: 10, color: colors.textMuted },
  marketplaceBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, marginBottom: 24 },
  marketplaceBtnText: { fontSize: 13, fontWeight: "500", color: colors.accent },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 16 },
  modalLabel: { fontSize: 12, fontWeight: "500", color: colors.textDark, marginBottom: 6 },
  modalInput: { backgroundColor: colors.background, borderRadius: 8, borderWidth: 0.5, borderColor: colors.border, padding: 11, fontSize: 13, color: colors.textDark, marginBottom: 14 },
  modalHint: { fontSize: 11, color: colors.textMuted, marginBottom: 8 },
  deptChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  deptChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  deptChipActive: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  deptChipText: { fontSize: 12, color: colors.textMuted, fontWeight: "500" },
  deptChipTextActive: { color: colors.accent },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 6 },
  modalCancel: { flex: 1, backgroundColor: colors.background, borderRadius: 8, padding: 13, alignItems: "center" },
  modalCancelText: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
  modalSave: { flex: 1, backgroundColor: colors.accent, borderRadius: 8, padding: 13, alignItems: "center" },
  modalSaveText: { fontSize: 14, color: colors.white, fontWeight: "500" },
});