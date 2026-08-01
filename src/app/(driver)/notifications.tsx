import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMyNotifications } from "../../services/notifications.service";
import { colors } from "../../constants/Colors";

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: colors.blueTint, color: colors.primary, icon: "people-outline", label: "Meeting" };
  if (type === "ALERT") return { bg: colors.dangerBg, color: colors.danger, icon: "alert-circle-outline", label: "Alert" };
  if (type === "WEATHER") return { bg: colors.successBg, color: colors.success, icon: "partly-sunny-outline", label: "Weather" };
  return { bg: colors.blueTint, color: colors.primary, icon: "notifications-outline", label: "Info" };
};

export default function DriverNotificationsScreen() {
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
      } catch (e) { console.log("driver notifications failed", e); }
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
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSub}>{notifications.length} new messages</Text>
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
            {!loading && notifications.map((n) => {
              const s = getTypeStyle(n.type);
              return (
                <View key={n.notifId} style={styles.notifCard}>
                  <View style={[styles.accent, { backgroundColor: s.color }]} />
                  <View style={styles.notifBody}>
                    <View style={styles.notifHeader}>
                      <View style={[styles.iconCircle, { backgroundColor: s.bg }]}>
                        <Ionicons name={s.icon as any} size={18} color={s.color} />
                      </View>
                      <Text style={[styles.typeTitle, { color: s.color }]}>{s.label}</Text>
                      <View style={styles.notifFooter}>
                        <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                        <Text style={styles.notifTime}>
                          {n.sentAt ? new Date(n.sentAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.notifMessage}>{n.message}</Text>
                    {n.sentByName && (
                      <Text style={styles.notifSender}>From {n.sentByName}</Text>
                    )}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: colors.textDark, marginBottom: 6 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: "center", paddingHorizontal: 40 },
  notifCard: { flexDirection: "row", backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, marginBottom: 12, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  accent: { width: 4 },
  notifBody: { flex: 1, padding: 14 },
  notifHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  iconCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  typeTitle: { fontSize: 13, fontWeight: "600", flex: 1 },
  notifMessage: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
  notifSender: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  notifFooter: { flexDirection: "row", alignItems: "center", gap: 4 },
  notifTime: { fontSize: 11, color: colors.textMuted },
});
