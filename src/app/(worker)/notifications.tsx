import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMyNotifications } from "../../services/notifications.service";
import { colors } from "../../constants/Colors";

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: colors.blueTint, color: colors.primary, icon: "people-outline" };
  if (type === "ALERT") return { bg: colors.dangerBg, color: colors.danger, icon: "alert-circle-outline" };
  if (type === "WEATHER") return { bg: colors.successBg, color: colors.success, icon: "partly-sunny-outline" };
  return { bg: colors.background, color: colors.textMuted, icon: "notifications-outline" };
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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSub}>{notifications.length} new messages</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}
            {!loading && notifications.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No notifications yet</Text>
                <Text style={styles.emptyText}>You'll see important updates and announcements here</Text>
              </View>
            )}
            {!loading && notifications.map((n, i) => {
              const s = getTypeStyle(n.type);
              return (
                <View key={n.notifId} style={styles.notifCard}>
                  <View style={[styles.iconCircle, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon as any} size={20} color={s.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifMessage}>{n.message}</Text>
                    <View style={styles.notifFooter}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.notifTime}>
                        {n.sentAt ? new Date(n.sentAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      </Text>
                    </View>
                  </View>
                  {n.type && (
                    <View style={[styles.typeBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.typeBadgeText, { color: s.color }]}>
                        {n.type === "MEETING" ? "Meeting" : n.type === "ALERT" ? "Alert" : n.type === "WEATHER" ? "Weather" : "Info"}
                      </Text>
                    </View>
                  )}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 6 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: "center", paddingHorizontal: 40 },
  notifCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  iconCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  notifContent: { flex: 1 },
  notifMessage: { fontSize: 14, color: colors.textDark, lineHeight: 20, marginBottom: 6 },
  notifFooter: { flexDirection: "row", alignItems: "center", gap: 4 },
  notifTime: { fontSize: 11, color: colors.textMuted },
  typeBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  typeBadgeText: { fontSize: 10, fontWeight: "500" },
});