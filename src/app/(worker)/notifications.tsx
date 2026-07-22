import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMyNotifications } from "../../services/notifications.service";

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: "#E3F2FD", color: "#0C447C", icon: "people-outline" };
  if (type === "ALERT") return { bg: "#FFEBEE", color: "#C62828", icon: "alert-circle-outline" };
  if (type === "WEATHER") return { bg: "#E8F5E9", color: "#1B5E20", icon: "partly-sunny-outline" };
  return { bg: "#F5F5F5", color: "#666", icon: "notifications-outline" };
};

export default function WorkerNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMyNotifications(token);
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("worker notifications failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const unreadCount = notifications.length;

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
                <Text style={styles.headerSub}>{unreadCount} messages</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />}
            {!loading && notifications.length === 0 && (
              <Text style={{ textAlign: "center", color: "#888", marginVertical: 30 }}>No notifications yet</Text>
            )}
            {!loading && notifications.map((n, i) => {
              const s = getTypeStyle(n.type);
              return (
                <View key={n.notifId} style={styles.item}>
                  <View style={[styles.iconCircle, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon as any} size={18} color={s.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemMessage}>{n.message}</Text>
                    <Text style={styles.itemTime}>{n.sentAt ? new Date(n.sentAt).toLocaleString() : ""}</Text>
                  </View>
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
  iconCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  itemContent: { flex: 1 },
  itemMessage: { fontSize: 13, color: "#1A1A1A", lineHeight: 18 },
  itemTime: { fontSize: 11, color: "#888", marginTop: 4 },
});