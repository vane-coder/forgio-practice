import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getNewsFeed } from "../../services/newsfeed.service";

export default function WorkerNewsFeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getNewsFeed(token);
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("worker newsfeed failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Factory News Feed</Text>
            <Text style={styles.headerSub}>Updates from your factory</Text>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color="#1565C0" style={{ marginVertical: 30 }} />}
            {!loading && posts.length === 0 && (
              <Text style={{ textAlign: "center", color: "#888", marginVertical: 30 }}>No posts yet</Text>
            )}
            {!loading && posts.map((post) => (
              <View key={post.postId} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{(post.authorName || "?").substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{post.authorName || "Staff"}</Text>
                    <Text style={styles.authorRole}>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: "#1565C0", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 13, fontWeight: "500", color: "#1565C0" },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  authorRole: { fontSize: 11, color: "#888", marginTop: 2 },
  postContent: { fontSize: 13, color: "#1A1A1A", lineHeight: 19 },
});