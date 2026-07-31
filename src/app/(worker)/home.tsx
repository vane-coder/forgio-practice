import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { getMyNotifications } from "../../services/notifications.service";
import { getNewsFeed } from "../../services/newsfeed.service";
import { colors } from "../../constants/Colors";

export default function WorkerHomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [latestNotif, setLatestNotif] = useState<any>(null);
  const [latestPost, setLatestPost] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const [profileRes, notifs, feed] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
          getMyNotifications(token).catch(() => []),
          getNewsFeed(token).catch(() => []),
        ]);
        setProfile(profileRes);
        if (Array.isArray(notifs) && notifs.length > 0) setLatestNotif(notifs[0]);
        if (Array.isArray(feed) && feed.length > 0) setLatestPost(feed[0]);
      } catch (e) { console.log("home load failed", e); }
    })();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = profile?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.name}>{profile?.name ?? "..."}</Text>
                <Text style={styles.deptText}>{profile?.departmentName ?? ""}</Text>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={() => router.push("/(worker)/profile")}>
                <Text style={styles.avatarText}>{initials}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.grid}>
              {[
                { label: "Enter production", icon: "clipboard-outline", route: "/(worker)/enter-production" },
                { label: "Record materials", icon: "cube-outline", route: "/(worker)/record-material" },
                { label: "Report breakdown", icon: "triangle-outline", route: "/(worker)/report-breakdown", color: colors.warning },
                { label: "My records", icon: "time-outline", route: "/(worker)/my-records" },
              ].map((item, i) => (
                <TouchableOpacity key={item.label} style={[styles.actionCard, i % 2 === 1 && styles.actionCardAlt]} onPress={() => router.push(item.route as any)}>
                  <Ionicons name={item.icon as any} size={28} color={item.color ?? (i % 2 === 0 ? colors.primary : colors.accent)} />
                  <Text style={styles.actionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Latest notification</Text>
            {latestNotif ? (
              <View style={styles.notifCard}>
                <View style={styles.notifIcon}>
                  <Ionicons name="people-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={styles.notifText}>{latestNotif.message}</Text>
                  <Text style={styles.notifTime}>{latestNotif.type}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.notifCard}>
                <View style={styles.notifContent}>
                  <Text style={styles.notifText}>No notifications yet.</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Latest news</Text>
            {latestPost ? (
              <View style={styles.newsCard}>
                <View style={styles.newsRow}>
                  <View style={styles.newsAvatar}>
                    <Text style={styles.newsAvatarText}>
                      {latestPost.authorName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                    </Text>
                  </View>
                  <View style={styles.newsInfo}>
                    <Text style={styles.newsAuthor}>{latestPost.authorName}</Text>
                    <Text style={styles.newsTime}>{latestPost.role}</Text>
                  </View>
                </View>
                <Text style={styles.newsText}>{latestPost.content}</Text>
              </View>
            ) : (
              <View style={styles.newsCard}>
                <Text style={styles.newsText}>No posts yet.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  greeting: { fontSize: 12, color: colors.headerSubtitle },
  name: { fontSize: 18, fontWeight: "500", color: colors.white },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontWeight: "500", color: colors.headerSubtitle },
  deptText: { fontSize: 11, color: colors.headerSubtitle },
  body: { padding: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  actionCard: { width: "47%", backgroundColor: colors.blueTint, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 16, alignItems: "center", gap: 8 },
  actionCardAlt: { backgroundColor: colors.accentLight },
  actionText: { fontSize: 12, fontWeight: "500", color: colors.textDark, textAlign: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 10 },
  notifCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 20 },
  notifIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  notifContent: { flex: 1 },
  notifText: { fontSize: 12, color: colors.textDark, lineHeight: 17 },
  notifTime: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  newsCard: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14, marginBottom: 20 },
  newsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  newsAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  newsAvatarText: { fontSize: 10, fontWeight: "500", color: colors.primary },
  newsInfo: { flex: 1 },
  newsAuthor: { fontSize: 11, fontWeight: "500", color: colors.textDark },
  newsTime: { fontSize: 10, color: colors.textMuted },
  newsText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
});
