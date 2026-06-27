import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const departments = [
  { id: 1, name: "Cutting", workers: 12, head: "Attuah Jessica", color: "#1565C0" },
  { id: 2, name: "Assembly", workers: 18, head: "Apoasan Akologo", color: "#2E7D32" },
  { id: 3, name: "Packaging", workers: 9, head: "Akoto Boakye", color: "#E65100" },
];

export default function DepartmentsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Departments</Text>
            <Text style={styles.headerSub}>{departments.length} departments · {departments.reduce((sum, d) => sum + d.workers, 0)} workers</Text>
          </View>

          <View style={styles.body}>

            {departments.map((dept) => (
              <View key={dept.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.colorDot, { backgroundColor: dept.color }]} />
                  <Text style={styles.deptName}>{dept.name}</Text>
                  <View style={styles.workerBadge}>
                    <Text style={styles.workerBadgeText}>{dept.workers} workers</Text>
                  </View>
                </View>
                <View style={styles.headRow}>
                  <Ionicons name="person-circle-outline" size={14} color="#888" />
                  <Text style={styles.headText}>Head: {dept.head}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push("/(manager)/permissions")}
                  >
                    <Ionicons name="people-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>View workers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="create-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Create department form */}
            {showForm ? (
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>Department name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Quality Control"
                  placeholderTextColor="#aaa"
                  value={newDeptName}
                  onChangeText={setNewDeptName}
                />
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.createBtn}>
                    <Text style={styles.createBtnText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowForm(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#1565C0" />
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  deptName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#1A1A1A" },
  workerBadge: { backgroundColor: "#E3F2FD", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  workerBadgeText: { fontSize: 10, color: "#0C447C", fontWeight: "500" },
  headRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  headText: { fontSize: 11, color: "#888" },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#E3F2FD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  actionBtnText: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#1565C0", borderStyle: "dashed", padding: 14, marginBottom: 20 },
  addBtnText: { fontSize: 13, fontWeight: "500", color: "#1565C0" },
  formCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  formInput: { borderWidth: 0.5, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 13, color: "#1A1A1A", marginBottom: 14 },
  formButtons: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#F5F5F5", borderRadius: 8, padding: 12, alignItems: "center" },
  cancelBtnText: { fontSize: 13, color: "#888", fontWeight: "500" },
  createBtn: { flex: 1, backgroundColor: "#1565C0", borderRadius: 8, padding: 12, alignItems: "center" },
  createBtnText: { fontSize: 13, color: "#fff", fontWeight: "500" },
});