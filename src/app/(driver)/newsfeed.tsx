import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getNewsFeed } from "../../services/newsfeed.service";
import { colors } from "../../constants/Colors";

export default function DriverNewsFeedScreen() {
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
      } catch (e) { console.log("driver newsfeed failed", e); }
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
            <Text style={styles.headerTitle}>Factory News Feed</Text>
            <Text style={styles.headerSub}>Updates from your factory</Text>
          </View>

          <View style={styles.body}>
            {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />}
            {!loading && posts.length === 0 && (
              <Text style={{ textAlign: "center", color: colors.textMuted, marginVertical: 30 }}>No posts yet</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 13, fontWeight: "500", color: colors.primary },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 13, fontWeight: "500", color: colors.textDark },
  authorRole: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  postContent: { fontSize: 13, color: colors.textDark, lineHeight: 19 },
});
