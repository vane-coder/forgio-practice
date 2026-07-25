import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { getMyNotifications } from "../../services/notifications.service";
import { getNewsFeed } from "../../services/newsfeed.service";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
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
                { label: "Report breakdown", icon: "triangle-outline", route: "/(worker)/report-breakdown", color: "#E65100" },
                { label: "My records", icon: "time-outline", route: "/(worker)/my-records" },
              ].map((item) => (
                <TouchableOpacity key={item.label} style={styles.actionCard} onPress={() => router.push(item.route as any)}>
                  <Ionicons name={item.icon as any} size={28} color={item.color ?? "#1565C0"} />
                  <Text style={styles.actionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Latest notification</Text>
            {latestNotif ? (
              <View style={styles.notifCard}>
                <View style={styles.notifIcon}>
                  <Ionicons name="people-outline" size={18} color="#0C447C" />
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
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  greeting: { fontSize: 12, color: "#90CAF9" },
  name: { fontSize: 18, fontWeight: "500", color: "#fff" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#0C447C", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, fontWeight: "500", color: "#90CAF9" },
  deptText: { fontSize: 11, color: "#90CAF9" },
  body: { padding: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  actionCard: { width: "47%", backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 16, alignItems: "center", gap: 8 },
  actionText: { fontSize: 12, fontWeight: "500", color: "#1A1A1A", textAlign: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 10 },
  notifCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 20 },
  notifIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  notifContent: { flex: 1 },
  notifText: { fontSize: 12, color: "#1A1A1A", lineHeight: 17 },
  notifTime: { fontSize: 10, color: "#888", marginTop: 4 },
  newsCard: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 20 },
  newsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  newsAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  newsAvatarText: { fontSize: 10, fontWeight: "500", color: "#0C447C" },
  newsInfo: { flex: 1 },
  newsAuthor: { fontSize: 11, fontWeight: "500", color: "#1A1A1A" },
  newsTime: { fontSize: 10, color: "#888" },
  newsText: { fontSize: 12, color: "#444", lineHeight: 18 },
});
