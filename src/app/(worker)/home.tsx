import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function WorkerHomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Good morning</Text>
                <Text style={styles.name}>Vanessa Oware</Text>
                 <Text style={styles.deptText}>Cutting Dept · Morning shift</Text>
              </View>
              
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => router.push("/(worker)/profile")}
              >
                <Text style={styles.avatarText}>VO</Text>
              </TouchableOpacity>
             
            </View>
          </View>

          <View style={styles.body}>

            {/* Quick actions */}
            <View style={styles.grid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/(worker)/enter-production")}
              >
                <Ionicons name="clipboard-outline" size={28} color="#1565C0" />
                <Text style={styles.actionText}>Enter production</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/(worker)/record-material")}
              >
                <Ionicons name="cube-outline" size={28} color="#1565C0" />
                <Text style={styles.actionText}>Record materials</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/(worker)/report-breakdown")}
              >
                <Ionicons name="triangle-outline" size={28} color="#E65100" />
                <Text style={styles.actionText}>Report breakdown</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/(worker)/my-records")}
              >
                <Ionicons name="time-outline" size={28} color="#1565C0" />
                <Text style={styles.actionText}>My records</Text>
              </TouchableOpacity>
            </View>

            {/* Latest notification */}
            <Text style={styles.sectionTitle}>Latest notification</Text>
            <View style={styles.notifCard}>
              <View style={styles.notifIcon}>
                <Ionicons name="people-outline" size={18} color="#0C447C" />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifText}>Team meeting today at 2PM in the assembly hall.</Text>
                <Text style={styles.notifTime}>2h ago · All workers</Text>
              </View>
            </View>

            {/* News feed preview */}
            <Text style={styles.sectionTitle}>Latest news</Text>
            <View style={styles.newsCard}>
              <View style={styles.newsRow}>
                <View style={styles.newsAvatar}>
                  <Text style={styles.newsAvatarText}>RP</Text>
                </View>
                <View style={styles.newsInfo}>
                  <Text style={styles.newsAuthor}>Raina Pryce</Text>
                  <Text style={styles.newsTime}>Manager · 2h ago</Text>
                </View>
              </View>
              <Text style={styles.newsText}>Production target for this week is 5,000 units. Let's push through!</Text>
            </View>

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