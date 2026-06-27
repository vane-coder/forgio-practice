import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const faqs = [
  { q: "How do I enter my daily production?", a: "From the home screen tap Enter production, fill in the product name, quantity and shift, then tap Submit." },
  { q: "How do I record materials I used?", a: "Tap Record materials on the home screen, enter the quantity used for each material and tap Save usage." },
  { q: "How do I report a machine breakdown?", a: "Tap Report breakdown, select the machine from the list, describe the problem, and tap Report breakdown." },
  { q: "Where can I see my past entries?", a: "Tap My records from the home screen to see all your previous production submissions." },
  { q: "How do I see notifications from my manager?", a: "Tap your avatar at the top right → Notifications to see all messages sent to you." },
];

export default function WorkerHelpScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & support</Text>
            <Text style={styles.headerSub}>Frequently asked questions</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.faqList}>
              {faqs.map((faq, i) => (
                <View key={i} style={[styles.faqItem, i === faqs.length - 1 && { borderBottomWidth: 0 }]}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => setExpanded(expanded === i ? null : i)}
                  >
                    <Text style={styles.faqQuestionText}>{faq.q}</Text>
                    <Ionicons name={expanded === i ? "chevron-up" : "chevron-down"} size={16} color="#888" />
                  </TouchableOpacity>
                  {expanded === i && (
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.contactCard}>
              <Ionicons name="mail-outline" size={20} color="#1565C0" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Still need help?</Text>
                <Text style={styles.contactText}>Email us at support@forgio.com</Text>
              </View>
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
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff" },
  headerSub: { fontSize: 11, color: "#90CAF9", marginTop: 2 },
  body: { padding: 16 },
  faqList: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  faqItem: { borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  faqQuestion: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  faqQuestionText: { flex: 1, fontSize: 13, fontWeight: "500", color: "#1A1A1A", paddingRight: 10 },
  faqAnswer: { fontSize: 12, color: "#666", lineHeight: 18, paddingHorizontal: 14, paddingBottom: 14 },
  contactCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#E3F2FD", borderRadius: 12, padding: 16, marginBottom: 24 },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 13, fontWeight: "500", color: "#0C447C" },
  contactText: { fontSize: 12, color: "#1565C0", marginTop: 2 },
});