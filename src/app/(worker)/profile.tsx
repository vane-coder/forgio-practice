import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const menuItems = [
  { id: 1, icon: "person-outline", label: "Edit profile", route: "/(worker)/edit-profile" },
  { id: 2, icon: "notifications-outline", label: "Notifications", route: "/(worker)/notifications" },
  { id: 3, icon: "newspaper-outline", label: "News feed", route: "/(worker)/newsfeed" },
  { id: 4, icon: "lock-closed-outline", label: "Change password", route: "/(worker)/change-password" },
  { id: 5, icon: "help-circle-outline", label: "Help & support", route: "/(worker)/help" },
];

export default function WorkerProfileScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>VO</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Vanessa Oware</Text>
                <Text style={styles.profileRole}>Worker</Text>
                <Text style={styles.profileFactory}>Cutting Dept · Morning shift</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            <View style={styles.menuCard}>
              {menuItems.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon as any} size={18} color="#1565C0" />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Ionicons name="key-outline" size={16} color="#1565C0" />
              <Text style={styles.forgotBtnText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => router.replace("/welcome")}
            >
              <Ionicons name="log-out-outline" size={18} color="#C62828" />
              <Text style={styles.logoutBtnText}>Log out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Forgio v1.0.0 · KNUST 2026</Text>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#0C447C", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 22, fontWeight: "bold", color: "#90CAF9" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "500", color: "#fff" },
  profileRole: { fontSize: 12, color: "#90CAF9", marginTop: 2 },
  profileFactory: { fontSize: 12, color: "#B3D4F4", marginTop: 2 },
  body: { padding: 16 },
  menuCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 14 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  menuIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  menuLabel: { flex: 1, fontSize: 14, color: "#1A1A1A" },
  forgotBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 14, marginBottom: 10 },
  forgotBtnText: { fontSize: 14, color: "#1565C0", fontWeight: "500" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FFEBEE", borderRadius: 10, padding: 14, marginBottom: 20 },
  logoutBtnText: { fontSize: 14, color: "#C62828", fontWeight: "500" },
  version: { textAlign: "center", fontSize: 12, color: "#aaa", marginBottom: 30 },
});