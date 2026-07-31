import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken, clearToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { colors } from "../../constants/Colors";

const menuItems = [
  { id: 1, icon: "person-outline", label: "Edit profile", route: "/(manager)/edit-profile" },
  { id: 2, icon: "business-outline", label: "Factory settings", route: "/(manager)/branches" },
  { id: 3, icon: "people-outline", label: "Manage workers", route: "/(manager)/permissions" },
  { id: 4, icon: "cube-outline", label: "Materials", route: "/(manager)/materials" },
  { id: 5, icon: "notifications-outline", label: "Notifications", route: "/(manager)/notifications" },
  { id: 6, icon: "newspaper-outline", label: "News feed", route: "/(manager)/newsfeed" },
  { id: 7, icon: "cart-outline", label: "Marketplace", route: "/(manager)/marketplace" },
  { id: 8, icon: "navigate-outline", label: "Shipments", route: "/(manager)/shipments" },
  { id: 9, icon: "map-outline", label: "Live tracking", route: "/(manager)/live-tracking" },
  { id: 10, icon: "sparkles-outline", label: "AI Assistant", route: "/(manager)/ai-assistant" },
  { id: 11, icon: "lock-closed-outline", label: "Change password", route: "/(manager)/change-password" },
  { id: 12, icon: "help-circle-outline", label: "Help & support", route: "/(manager)/help" },
];

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [factoryName, setFactoryName] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const p = await res.json();
          setName(p.name || "");
          setRole(p.role || "");
          setFactoryName(p.factoryName || "");
          setInitials(
            (p.name || "?")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
          );
        }
      } catch (e) {
        console.log("profile load failed", e);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace("/welcome");
  };

  const prettyRole = (r: string) => {
    if (r === "MANAGER") return "Factory Manager";
    if (r === "WORKER") return "Worker";
    if (r === "DRIVER") return "Driver";
    if (r === "DEPT_HEAD") return "Department Head";
    return r;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials || "?"}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{name || "Loading..."}</Text>
                <Text style={styles.profileRole}>{prettyRole(role)}</Text>
                <Text style={styles.profileFactory}>{factoryName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>

            {/* Menu items */}
            <View style={styles.menuCard}>
              {menuItems.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push("/(auth)/forgot-password")}>
              <Ionicons name="key-outline" size={16} color={colors.primary} />
              <Text style={styles.forgotBtnText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 22, fontWeight: "bold", color: colors.headerSubtitle },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "500", color: colors.white },
  profileRole: { fontSize: 12, color: colors.headerSubtitle, marginTop: 2 },
  profileFactory: { fontSize: 12, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  menuCard: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 14 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  menuIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  menuLabel: { flex: 1, fontSize: 14, color: colors.textDark },
  forgotBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.blueTint, borderRadius: 10, padding: 14, marginBottom: 10 },
  forgotBtnText: { fontSize: 14, color: colors.primary, fontWeight: "500" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.dangerBg, borderRadius: 10, padding: 14, marginBottom: 20 },
  logoutBtnText: { fontSize: 14, color: colors.danger, fontWeight: "500" },
  version: { textAlign: "center", fontSize: 12, color: colors.textMuted, marginBottom: 30 },
});