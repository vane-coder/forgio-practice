import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getWorkersWithPermissions, assignPermission } from "../../services/permissions.service";

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
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{workers.length} workers</Text>
              </View>
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
  countBadge: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontSize: 11, color: "#fff" },
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
});
