import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Dummy AI suggestions — replace with real API call from ai.service.ts later
const suggestions = [
  {
    id: 1,
    type: "insight",
    icon: "bulb-outline",
    iconColor: "#E65100",
    title: "Today's insight",
    text: "Production dropped 28% this week. Machine 3 downtime on Wednesday is likely the cause. Schedule maintenance now.",
    bgColor: "#FFF8E1",
    borderColor: "#E65100",
    titleColor: "#854F0B",
    textColor: "#633806",
  },
  {
    id: 2,
    type: "restock",
    icon: "cube-outline",
    iconColor: "#1565C0",
    title: "Restock suggestion",
    text: "Fabric will run out in approximately 3 days based on current usage. Order at least 200kg this week.",
    bgColor: "#fff",
    borderColor: "#e0e0e0",
    titleColor: "#0C447C",
    textColor: "#185FA5",
  },
  {
    id: 3,
    type: "waste",
    icon: "warning-outline",
    iconColor: "#E65100",
    title: "Waste alert",
    text: "Cutting department waste is 22% above your monthly average. Review material handling in that shift.",
    bgColor: "#fff",
    borderColor: "#e0e0e0",
    titleColor: "#854F0B",
    textColor: "#633806",
  },
  {
    id: 4,
    type: "maintenance",
    icon: "construct-outline",
    iconColor: "#C62828",
    title: "Maintenance prediction",
    text: "Machine 3 has broken down 4 times this month. Based on the pattern, the next failure is likely within 5 days. Schedule a service now.",
    bgColor: "#fff",
    borderColor: "#e0e0e0",
    titleColor: "#791F1F",
    textColor: "#501313",
  },
  {
    id: 5,
    type: "profit",
    icon: "trending-down-outline",
    iconColor: "#1565C0",
    title: "Profit insight",
    text: "Estimated profit per unit dropped this week due to a 15% increase in material waste. Reducing waste in the packaging stage could recover GHS 800 weekly.",
    bgColor: "#fff",
    borderColor: "#e0e0e0",
    titleColor: "#0C447C",
    textColor: "#185FA5",
  },
];

export default function AIAssistantScreen() {
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const handleRefresh = () => {
    setLoading(true);
    // TODO: call ai.service.ts getAISuggestions() here
    setTimeout(() => {
      setLoading(false);
      setLastRefreshed("Just now");
    }, 2000);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSub}>Powered by Forgio Intelligence</Text>
            </View>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles-outline" size={14} color="#0C447C" />
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>

          <View style={styles.body}>

            {/* Last refreshed */}
            <View style={styles.refreshRow}>
              <Ionicons name="time-outline" size={13} color="#888" />
              <Text style={styles.refreshTime}>Last updated: {lastRefreshed}</Text>
            </View>

            {/* Suggestion cards */}
            {suggestions.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor,
                  },
                  item.type === "insight" && styles.insightCard,
                ]}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name={item.icon as any} size={15} color={item.iconColor} />
                  <Text style={[styles.cardTitle, { color: item.titleColor }]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={[styles.cardText, { color: item.textColor }]}>
                  {item.text}
                </Text>
              </View>
            ))}

            {/* Refresh button */}
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#1565C0" />
              ) : (
                <Ionicons name="refresh-outline" size={18} color="#1565C0" />
              )}
              <Text style={styles.refreshBtnText}>
                {loading ? "Analysing factory data..." : "Refresh insights"}
              </Text>
            </TouchableOpacity>

            {/* Info note */}
            <View style={styles.infoNote}>
              <Ionicons name="information-circle-outline" size={14} color="#888" />
              <Text style={styles.infoText}>
                Suggestions are based on your factory's production, waste, material, and machine data. Insights refresh daily or on demand.
              </Text>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // Header
  header: {
    backgroundColor: "#1565C0",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  headerSub: {
    fontSize: 11,
    color: "#90CAF9",
    marginTop: 2,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0C447C",
  },

  // Body
  body: {
    padding: 16,
  },

  // Refresh row
  refreshRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 12,
  },
  refreshTime: {
    fontSize: 11,
    color: "#888",
  },

  // Cards
  card: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 10,
  },
  insightCard: {
    borderLeftWidth: 3,
    borderRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  cardText: {
    fontSize: 11,
    lineHeight: 17,
  },

  // Refresh button
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    marginBottom: 14,
  },
  refreshBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0C447C",
  },

  // Info note
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: "#888",
    lineHeight: 16,
  },
});