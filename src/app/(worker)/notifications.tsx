import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const notifications = [
  { id: 1, message: "Team meeting today at 2PM in the assembly hall.", type: "MEETING", sentAt: "2h ago", read: false },
  { id: 2, message: "Cotton fabric stock is critically low. Cutting dept please reduce usage.", type: "ALERT", sentAt: "5h ago", read: false },
  { id: 3, message: "Heavy rain expected tomorrow. Secure all outdoor materials.", type: "WEATHER", sentAt: "Yesterday", read: true },
  { id: 4, message: "Production target for this week is 5,000 units. Let's push through!", type: "GENERAL", sentAt: "2 days ago", read: true },
];

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: "#E3F2FD", color: "#0C447C", icon: "people-outline" };
  if (type === "ALERT") return { bg: "#FFEBEE", color: "#C62828", icon: "alert-circle-outline" };
  if (type === "WEATHER") return { bg: "#E8F5E9", color: "#1B5E20", icon: "partly-sunny-outline" };
  return { bg: "#F5F5F5", color: "#666", icon: "notifications-outline" };
};

export default function WorkerNotificationsScreen() {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSub}>{unreadCount} unread messages</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            {notifications.map((n, i) => {
              const s = getTypeStyle(n.type);
              return (
                <View
                  key={n.id}
                  style={[styles.item, !n.read && styles.itemUnread]}
                >
                  <View style={[styles.iconCircle, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemMessage}>{n.message}</Text>
                    <Text style={styles.itemTime}>{n.sentAt}</Text>
                  </View>
                  {!n.read && <View style={styles.unreadDot} />}
                </View>
              );
            })}
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
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16, gap: 10 },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14 },
  itemUnread: { borderColor: "#1565C0", borderWidth: 1 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  itemContent: { flex: 1 },
  itemMessage: { fontSize: 13, color: "#1A1A1A", lineHeight: 18 },
  itemTime: { fontSize: 11, color: "#888", marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#1565C0", marginTop: 4 },
});