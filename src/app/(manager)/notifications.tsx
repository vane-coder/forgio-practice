import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, ActivityIndicator } from "react-native";
import { getToken } from "../../auth";
import { sendBulkNotification, getSentNotifications } from "../../services/notifications.service";
import { getDepartments } from "../../services/departments.service";
import { colors } from "../../constants/Colors";

const getTypeStyle = (type: string) => {
  if (type === "MEETING") return { bg: colors.blueTint, color: colors.primary, icon: "people-outline" };
  if (type === "ALERT") return { bg: colors.dangerBg, color: colors.danger, icon: "alert-circle-outline" };
  if (type === "WEATHER") return { bg: colors.successBg, color: "#1B5E20", icon: "partly-sunny-outline" };
  return { bg: "#F5F5F5", color: colors.textMuted, icon: "notifications-outline" };
};

export default function NotificationsScreen() {
  const [message, setMessage] = useState("");
  const [targetDeptId, setTargetDeptId] = useState<string | null>(null);
  const [type, setType] = useState("GENERAL");
  const [tab, setTab] = useState("SEND");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const loadSent = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getSentNotifications(token);
        setSent(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.log("sent load failed", e); }
  };

  const loadDepartments = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getDepartments(token);
        setDepartments(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.log("departments load failed", e); }
  };

  useEffect(() => { loadDepartments(); }, []);
  useEffect(() => { if (tab === "HISTORY") loadSent(); }, [tab]);

  const handleSend = async () => {
    if (!message.trim()) { Alert.alert("Empty message", "Please type a message."); return; }
    setSending(true);
    try {
      const token = await getToken();
      if (token) {
        await sendBulkNotification(token, {
          message,
          type: (type as any),
          targetDeptId: targetDeptId || undefined,
        } as any);
        Alert.alert("Sent", "Your notification was sent.");
        setMessage("");
        await loadSent();
      }
    } catch (e) {
      Alert.alert("Failed", "Could not send notification.");
    } finally { setSending(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
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
                  <TouchableOpacity
                    style={[styles.chip, targetDeptId === null && styles.chipActive]}
                    onPress={() => setTargetDeptId(null)}
                  >
                    <Text style={[styles.chipText, targetDeptId === null && styles.chipTextActive]}>All workers</Text>
                  </TouchableOpacity>
                  {departments.map((d) => (
                    <TouchableOpacity
                      key={d.deptId}
                      style={[styles.chip, targetDeptId === d.deptId && styles.chipActive]}
                      onPress={() => setTargetDeptId(d.deptId)}
                    >
                      <Text style={[styles.chipText, targetDeptId === d.deptId && styles.chipTextActive]}>
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {departments.length === 0 && (
                    <Text style={{ fontSize: 12, color: colors.textMuted, paddingVertical: 6 }}>
                      No departments yet — create one to target specific teams.
                    </Text>
                  )}
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
                  placeholderTextColor={colors.textMuted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                />

                <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
                  <Ionicons name="send-outline" size={18} color={colors.white} />
                  <Text style={styles.sendBtnText}>{sending ? "Sending..." : "Send notification"}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Previously sent</Text>
                <View style={styles.historyList}>
                  {sent.length === 0 && (
                    <Text style={{ textAlign: "center", color: colors.textMuted, padding: 20 }}>
                      No notifications sent yet.
                    </Text>
                  )}
                  {sent.map((n, i) => {
                    const st = getTypeStyle(n.type);
                    return (
                      <View key={n.notifId} style={[styles.historyItem, i === sent.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={[styles.historyIconWrap, { backgroundColor: st.bg }]}>
                          <Ionicons name={st.icon as any} size={18} color={st.color} />
                        </View>
                        <View style={styles.historyContent}>
                          <View style={styles.historyTopRow}>
                            <View style={[styles.typePill, { backgroundColor: st.bg }]}>
                              <Text style={[styles.typePillText, { color: st.color }]}>{n.type}</Text>
                            </View>
                            <Text style={styles.historySentAt}>
                              {n.sentAt ? new Date(n.sentAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                            </Text>
                          </View>
                          <Text style={styles.historyMessage}>{n.message}</Text>
                          <View style={styles.historyTargetRow}>
                            <Ionicons name="people-outline" size={12} color={colors.textMuted} />
                            <Text style={styles.historyTarget}>
                              {n.targetDeptName || n.targetRole || "All workers"}
                            </Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  tabRow: { flexDirection: "row", backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontSize: 13, color: colors.textMuted },
  tabTextActive: { color: colors.white, fontWeight: "500" },
  label: { fontSize: 14, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.border },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 14, color: colors.textMuted },
  chipTextActive: { color: colors.white, fontWeight: "500" },
  messageInput: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 13, color: colors.textDark, minHeight: 100, textAlignVertical: "top", marginBottom: 14 },
  sendBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: 10, padding: 14, marginBottom: 24 },
  sendBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  sectionTitle: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 10 },
  historyList: { gap: 10, marginBottom: 24 },
  historyItem: { flexDirection: "row", gap: 12, backgroundColor: colors.white, borderRadius: 12, borderWidth: 0.5, borderColor: colors.border, padding: 14 },
  historyIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  historyContent: { flex: 1 },
  historyTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  typePill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  typePillText: { fontSize: 9, fontWeight: "600" },
  historyMessage: { fontSize: 13, color: colors.textDark, lineHeight: 18, marginBottom: 8 },
  historyTargetRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  historyTarget: { fontSize: 11, color: colors.textMuted, fontWeight: "500" },
  historySentAt: { fontSize: 10, color: colors.textMuted },
});