import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../../constants/Colors";

export default function BranchDetailsScreen() {
  const params = useLocalSearchParams<{
    branchId?: string;
    name?: string;
    location?: string;
    workerCount?: string;
    machineCount?: string;
    isMain?: string;
  }>();

  const name = params.name || "Warehouse";
  const location = params.location || "No location set";
  const workerCount = params.workerCount || "0";
  const machineCount = params.machineCount || "0";
  const isMain = params.isMain === "1";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View style={styles.headerIcon}>
                <Ionicons name="business-outline" size={26} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>{name}</Text>
                <Text style={styles.headerSub}>{location}</Text>
              </View>
              <View style={[styles.tag, isMain ? { backgroundColor: colors.successBg } : { backgroundColor: colors.blueTint }]}>
                <Text style={[styles.tagText, isMain ? { color: colors.success } : { color: colors.primary }]}>
                  {isMain ? "Main" : "Warehouse"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="people-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{workerCount}</Text>
                <Text style={styles.statLabel}>Workers</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, styles.statIconAlt]}>
                  <Ionicons name="construct-outline" size={20} color={colors.accent} />
                </View>
                <Text style={styles.statValue}>{machineCount}</Text>
                <Text style={styles.statLabel}>Machines</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>

              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="git-branch-outline" size={16} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{isMain ? "Main warehouse" : "Warehouse"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.shipmentsBtn}
              onPress={() => router.push("/(manager)/shipments")}
            >
              <Ionicons name="swap-horizontal-outline" size={16} color={colors.white} />
              <Text style={styles.shipmentsBtnText}>View shipments</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.white },
  headerSub: { fontSize: 12, color: colors.headerSubtitle, marginTop: 2 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: "600" },
  body: { padding: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, alignItems: "center" },
  statIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  statIconAlt: { backgroundColor: colors.accentLight },
  statValue: { fontSize: 20, fontWeight: "600", color: colors.textDark },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  section: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: colors.textDark, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  detailLabel: { fontSize: 12, color: colors.textMuted, width: 70 },
  detailValue: { flex: 1, fontSize: 13, color: colors.textDark, fontWeight: "500", textAlign: "right" },
  shipmentsBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14 },
  shipmentsBtnText: { fontSize: 14, color: colors.white, fontWeight: "600" },
});
