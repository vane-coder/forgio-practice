import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const branches = [
  { id: 1, name: "Kumasi HQ", address: "Adum, Kumasi", workers: 39, machines: 8, isMain: true },
  { id: 2, name: "Accra Branch", address: "Tema Industrial Area, Accra", workers: 21, machines: 5, isMain: false },
  { id: 3, name: "Takoradi Branch", address: "Harbour Area, Takoradi", workers: 14, machines: 3, isMain: false },
];

export default function BranchesScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Branches</Text>
              <Text style={styles.headerSub}>{branches.length} locations</Text>
            </View>
          </View>

          <View style={styles.body}>

            {branches.map((branch) => (
              <View key={branch.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="business-outline" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.cardTopInfo}>
                    <Text style={styles.branchName}>{branch.name}</Text>
                    <Text style={styles.branchAddress}>{branch.address}</Text>
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
                    <Text style={styles.statText}>{branch.workers} workers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="construct-outline" size={14} color="#888" />
                    <Text style={styles.statText}>{branch.machines} machines</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="eye-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>View details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="swap-horizontal-outline" size={14} color="#1565C0" />
                    <Text style={styles.actionBtnText}>Switch to branch</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add-circle-outline" size={18} color="#1565C0" />
              <Text style={styles.addBtnText}>Add branch</Text>
            </TouchableOpacity>

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
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  cardTopInfo: { flex: 1 },
  branchName: { fontSize: 14, fontWeight: "500", color: "#1A1A1A" },
  branchAddress: { fontSize: 11, color: "#888", marginTop: 2 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 12 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  statText: { fontSize: 11, color: "#888" },
  cardActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#E3F2FD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flex: 1, justifyContent: "center" },
  actionBtnText: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#1565C0", borderStyle: "dashed", padding: 14, marginBottom: 20 },
  addBtnText: { fontSize: 13, fontWeight: "500", color: "#1565C0" },
});