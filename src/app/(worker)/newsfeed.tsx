import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const posts = [
  { id: 1, author: "Raina Pryce", initials: "RP", role: "Manager", time: "2h ago", content: "Production target for this week is 5,000 units. Let's push through! Great work everyone so far." },
  { id: 2, author: "Attuah Jessica", initials: "AJ", role: "Dept Head · Cutting", time: "5h ago", content: "Cutting dept hit 800 units today. Amazing effort from the team!" },
  { id: 3, author: "Raina Pryce", initials: "RP", role: "Manager", time: "Yesterday", content: "Reminder: all production entries must be submitted before end of shift. No late submissions." },
];

export default function WorkerNewsFeedScreen() {
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
            {posts.map((post) => (
              <View key={post.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.initials}</Text>
                  </View>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.authorRole}>{post.role} · {post.time}</Text>
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
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 12, fontWeight: "500", color: "#0C447C" },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 13, fontWeight: "500", color: "#1A1A1A" },
  authorRole: { fontSize: 11, color: "#888", marginTop: 1 },
  postContent: { fontSize: 13, color: "#444", lineHeight: 19 },
});