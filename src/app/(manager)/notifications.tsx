import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const sentNotifications = [
  { id: 1, message: "Team meeting today at 2PM in the assembly hall.", type: "MEETING", target: "All workers", sentAt: "2h ago" },
  { id: 2, message: "Cotton fabric stock is critically low. Cutting dept please reduce usage.", type: "ALERT", target: "Cutting dept", sentAt: "5h ago" },
  { id: 3, message: "Heavy rain expected tomorrow. Secure all outdoor materials.", type: "WEATHER", target: "All workers", sentAt: "Yesterday" },
];

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: "#E3F2FD", color: "#0C447C", icon: "people-outline" };
  if (type === "ALERT") return { bg: "#FFEBEE", color: "#C62828", icon: "alert-circle-outline" };
  if (type === "WEATHER") return { bg: "#E8F5E9", color: "#1B5E20", icon: "partly-sunny-outline" };
  return { bg: "#F5F5F5", color: "#666", icon: "notifications-outline" };
};

export default function NotificationsScreen() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [type, setType] = useState("GENERAL");
  const [tab, setTab] = useState("SEND");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSub}>Send messages to your team</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.tabRow}>
              <TouchableOpacity style={[styles.tab, tab === "SEND" && styles.tabActive]} onPress={() => setTab("SEND")}>
                <Text style={[styles.tabText, tab === "SEND" && styles.tabTextActive]}>Send new</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, tab === "HISTORY" && styles.tabActive]} onPress={() => setTab("HISTORY")}>
                <Text style={[styles.tabText, tab === "HISTORY" && styles.tabTextActive]}>History</Text>
              </TouchableOpacity>
            </View>

            {tab === "SEND" ? (
              <>
                <Text style={styles.label}>Send to</Text>
                <View style={styles.chipRow}>
                  {["ALL", "CUTTING", "ASSEMBLY", "PACKAGING"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, target === t && styles.chipActive]}
                      onPress={() => setTarget(t)}
                    >
                      <Text style={[styles.chipText, target === t && styles.chipTextActive]}>
                        {t === "ALL" ? "All workers" : t.charAt(0) + t.slice(1).toLowerCase() + " dept"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Type</Text>
                <View style={styles.chipRow}>
                  {["GENERAL", "MEETING", "ALERT", "WEATHER"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, type === t && styles.chipActive]}
                      onPress={() => setType(t)}
                    >
                      <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type your message here..."
                  placeholderTextColor="#aaa"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                />

                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={() => {
                    setMessage("");
                    setTab("HISTORY");
                  }}
                >
                  <Ionicons name="send-outline" size={18} color="#fff" />
                  <Text style={styles.sendBtnText}>Send notification</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Previously sent</Text>
                <View style={styles.historyList}>
                  {sentNotifications.map((n, i) => {
                    const s = getTypeStyle(n.type);
                    return (
                      <View key={n.id} style={[styles.historyItem, i === sentNotifications.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={[styles.historyIcon, { backgroundColor: s.bg }]}>
                          <Ionicons name={s.icon as any} size={16} color={s.color} />
                        </View>
                        <View style={styles.historyContent}>
                          <Text style={styles.historyMessage}>{n.message}</Text>
                          <View style={styles.historyMeta}>
                            <Text style={styles.historyTarget}>{n.target}</Text>
                            <Text style={styles.historySentAt}>{n.sentAt}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
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
  headerTitle: { fontSize: 20, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16 },
  tabRow: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#1565C0" },
  tabText: { fontSize: 13, color: "#888" },
  tabTextActive: { color: "#fff", fontWeight: "500" },
  label: { fontSize: 14, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#e0e0e0" },
  chipActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  chipText: { fontSize: 14, color: "#888" },
  chipTextActive: { color: "#fff", fontWeight: "500" },
  messageInput: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 13, color: "#1A1A1A", minHeight: 100, textAlignVertical: "top", marginBottom: 14 },
  sendBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#1565C0", borderRadius: 10, padding: 14, marginBottom: 24 },
  sendBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 10 },
  historyList: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 24 },
  historyItem: { flexDirection: "row", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  historyIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  historyContent: { flex: 1 },
  historyMessage: { fontSize: 13, color: "#1A1A1A", lineHeight: 17, marginBottom: 6 },
  historyMeta: { flexDirection: "row", justifyContent: "space-between" },
  historyTarget: { fontSize: 11, color: "#1565C0", fontWeight: "500" },
  historySentAt: { fontSize: 10, color: "#888" },
});