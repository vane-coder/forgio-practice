import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function BranchDetailsScreen() {
  const params = useLocalSearchParams<{
    branchId?: string;
    name?: string;
    location?: string;
    workerCount?: string;
    machineCount?: string;
    isMain?: string;
  }>();

  const name = params.name || "Branch";
  const location = params.location || "No location set";
  const workerCount = params.workerCount || "0";
  const machineCount = params.machineCount || "0";
  const isMain = params.isMain === "1";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View style={styles.headerIcon}>
                <Ionicons name="business-outline" size={26} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.headerSub}>{location}</Text>
              </View>
              <View style={[styles.tag, isMain ? { backgroundColor: "#E8F5E9" } : { backgroundColor: "#E3F2FD" }]}>
                <Text style={[styles.tagText, isMain ? { color: "#1B5E20" } : { color: "#0C447C" }]}>
                  {isMain ? "Main" : "Branch"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="people-outline" size={20} color="#1565C0" />
                </View>
                <Text style={styles.statValue}>{workerCount}</Text>
                <Text style={styles.statLabel}>Workers</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="construct-outline" size={20} color="#1565C0" />
                </View>
                <Text style={styles.statValue}>{machineCount}</Text>
                <Text style={styles.statLabel}>Machines</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>

              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={16} color="#888" />
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#888" />
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="git-branch-outline" size={16} color="#888" />
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{isMain ? "Main branch" : "Branch"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.shipmentsBtn}
              onPress={() => router.push("/(manager)/shipments")}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color="#fff" />
              <Text style={styles.shipmentsBtnText}>View shipments</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  headerSub: { fontSize: 12, color: "#90CAF9", marginTop: 2 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: "600" },
  body: { padding: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 16, alignItems: "center" },
  statIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "600", color: "#1A1A1A" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  section: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  detailLabel: { fontSize: 12, color: "#888", width: 70 },
  detailValue: { flex: 1, fontSize: 13, color: "#1A1A1A", fontWeight: "500", textAlign: "right" },
  shipmentsBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14 },
  shipmentsBtnText: { fontSize: 14, color: "#fff", fontWeight: "600" },
});
