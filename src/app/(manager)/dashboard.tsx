import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const username = "Vanessa Oware";
const initials = "VO";

export default function DashboardScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>

            <View style={styles.subheader}>
              <View>
                <Text style={styles.greeting}>Good morning</Text>
                <Text style={styles.username}>{username}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>

            <View style={styles.productionCard}>
              <Text style={styles.productionLabel}>Today's production</Text>
              <Text style={styles.productionRow}>
                <Text style={styles.productionNumber}>1,240 </Text>
                <Text style={styles.productionUnit}>units</Text>
              </Text>
            </View>

          </View>

          {/* BODY */}
          <View style={styles.body}>

            <View style={styles.statRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Materials</Text>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statSub}>2 low stock</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Machines</Text>
                <Text style={styles.statNumber}>8</Text>
                <Text style={[styles.statSub, { color: "#E65100" }]}>1 stopped</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Workers</Text>
                <Text style={styles.statNumber}>39</Text>
                <Text style={styles.statSub}>On shift</Text>
              </View>
            </View>

            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Ionicons name="bulb-outline" size={16} color="#E65100" />
                <Text style={styles.aiTitle}>AI Insight</Text>
              </View>
              <Text style={styles.aiText}>
                Fabric stock will run out in approximately 3 days based on current usage. Consider ordering at least 200kg this week.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Quick actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/reports")}>
                <Ionicons name="bar-chart-outline" size={24} color="#1565C0" />
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/permissions")}>
                <Ionicons name="people-outline" size={24} color="#1565C0" />
                <Text style={styles.actionText}>Workers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/machines")}>
                <Ionicons name="construct-outline" size={24} color="#1565C0" />
                <Text style={styles.actionText}>Machines</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(manager)/marketplace")}>
                <Ionicons name="cart-outline" size={24} color="#1565C0" />
                <Text style={styles.actionText}>Market</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#2E7D32" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Production entry submitted</Text>
                <Text style={styles.activitySub}>Vanessa · Cutting dept · 2h ago</Text>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>Done</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="alert-circle-outline" size={20} color="#C62828" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Machine breakdown reported</Text>
                <Text style={styles.activitySub}>Sewing Machine 3 · 4h ago</Text>
              </View>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeRedText}>Alert</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="cube-outline" size={20} color="#E65100" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Low stock alert</Text>
                <Text style={styles.activitySub}>Cotton Fabric · 48kg remaining</Text>
              </View>
              <View style={styles.badgeOrange}>
                <Text style={styles.badgeOrangeText}>Low</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Ionicons name="partly-sunny-outline" size={20} color="#1565C0" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.weatherTitle}>Weather alert</Text>
                <Text style={styles.weatherText}>Heavy rain expected in Kumasi tomorrow. Secure outdoor materials.</Text>
              </View>
            </View>

          </View>

        </ScrollView>

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={22} color="#1565C0" />
            <Text style={styles.navTextActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(manager)/reports")}>
            <Ionicons name="bar-chart-outline" size={22} color="#999" />
            <Text style={styles.navText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(manager)/departments")}>
            <Ionicons name="business-outline" size={22} color="#999" />
            <Text style={styles.navText}>Factory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={22} color="#999" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  subheader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 },
  greeting: { fontSize: 13, color: "#90CAF9" },
  username: { fontSize: 20, fontWeight: "500", color: "#fff", marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#0C447C", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 15, fontWeight: "500", color: "#90CAF9" },
  productionCard: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 14, width: "100%" },
  productionLabel: { fontSize: 11, color: "#B3D4F4" },
  productionRow: { marginTop: 4 },
  productionNumber: { fontSize: 28, fontWeight: "500", color: "#fff" },
  productionUnit: { fontSize: 14, color: "#90CAF9" },
  body: { padding: 16 },
  statRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 12 },
  statLabel: { fontSize: 10, color: "#1565C0" },
  statNumber: { fontSize: 20, fontWeight: "500", color: "#1A1A1A", marginTop: 4 },
  statSub: { fontSize: 9, color: "#888", marginTop: 2 },
  aiCard: { backgroundColor: "#FFF8E1", borderRadius: 10, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: "#E65100" },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  aiTitle: { fontSize: 12, fontWeight: "500", color: "#E65100" },
  aiText: { fontSize: 12, color: "#5D4037", lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: "500", color: "#1A1A1A", marginBottom: 10 },
  actionsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", gap: 6, borderWidth: 0.5, borderColor: "#E0E0E0" },
  actionText: { fontSize: 10, color: "#1A1A1A", fontWeight: "500" },
  activityItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: "#E0E0E0", gap: 10 },
  activityIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 12, fontWeight: "500", color: "#1A1A1A" },
  activitySub: { fontSize: 10, color: "#888", marginTop: 2 },
  badgeGreen: { backgroundColor: "#E8F5E9", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeGreenText: { fontSize: 10, color: "#2E7D32" },
  badgeRed: { backgroundColor: "#FFEBEE", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeRedText: { fontSize: 10, color: "#C62828" },
  badgeOrange: { backgroundColor: "#FFF3E0", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeOrangeText: { fontSize: 10, color: "#E65100" },
  weatherCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#E3F2FD", borderRadius: 10, padding: 14, marginTop: 6, marginBottom: 20 },
  weatherTitle: { fontSize: 12, fontWeight: "500", color: "#1565C0" },
  weatherText: { fontSize: 11, color: "#0C447C", marginTop: 2, lineHeight: 16 },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: "#eee", backgroundColor: "#fff" },
  navItem: { alignItems: "center", gap: 3 },
  navTextActive: { fontSize: 10, color: "#1565C0" },
  navText: { fontSize: 10, color: "#999" },
});