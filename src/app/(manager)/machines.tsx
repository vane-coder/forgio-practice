<<<<<<< HEAD
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";

const machines = [
  {
    id: 1,
    name: "Cutting Machine 1",
    status: "running",
    detail: "Last service: 12 Apr",
    icon: "✂️",
  },
  {
    id: 2,
    name: "Sewing Machine 3",
    status: "stopped",
    detail: "Broke down 4x this month",
    icon: "🧵",
    alert: true,
  },
  {
    id: 3,
    name: "Packaging Unit 2",
    status: "maintenance",
    detail: "Last service: 2 Apr",
    icon: "📦",
  },
];

const statusConfig = {
  running: {
    label: "Running",
    bg: "rgba(16, 185, 129, 0.15)",
    text: "#34d399",
    dot: "#34d399",
    border: "rgba(16, 185, 129, 0.2)",
  },
  stopped: {
    label: "Stopped",
    bg: "rgba(239, 68, 68, 0.15)",
    text: "#f87171",
    dot: "#f87171",
    border: "rgba(239, 68, 68, 0.2)",
  },
  maintenance: {
    label: "Maintenance",
    bg: "rgba(245, 158, 11, 0.15)",
    text: "#fbbf24",
    dot: "#fbbf24",
    border: "rgba(245, 158, 11, 0.2)",
  },
};

interface MachineProps {
  machine: {
    id: number;
    name: string;
    status: 'running' | 'stopped' | 'maintenance';
    detail: string;
    icon: string;
    alert?: boolean;
  };
}

function MachineCard({ machine }: {machine : any}) {
  const cfg = statusConfig[machine.status as keyof typeof statusConfig];
  
=======
import { View, Text, StyleSheet } from "react-native";
import React from "react";
>>>>>>> 329c28004768e3ee19a8f29d040ba98193aec946

  return (
    <Pressable 
      style={[
        styles.card, 
        { borderColor: cfg.border }
      ]}
    >
      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: cfg.bg }]}>
        <Text style={styles.iconText}>{machine.icon}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.machineName} numberOfLines={1}>
          {machine.name}
        </Text>
        <Text style={[styles.machineDetail, machine.alert && styles.alertText]}>
          {machine.detail}
        </Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
        <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
      </View>
    </Pressable>
  );
}

export default function MachinesDashboard() {
  return (
    <View style={styles.container}>
      {/* Outer Phone Frame Emulation */}
      <View style={styles.phoneFrame}>
        {/* Notch */}
        <View style={styles.notchContainer}>
          <View style={styles.notch} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Machines</Text>
            <Text style={styles.headerSubtitle}>
              {machines.length} machines registered
            </Text>
          </View>

          {/* Machine list */}
          <View style={styles.listContainer}>
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </View>

          {/* AI suggestion banner */}
          <View style={styles.aiBanner}>
            <View style={styles.aiRow}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTag}>AI SUGGESTION</Text>
                <Text style={styles.aiDescription}>
                  Schedule service for{" "}
                  <Text style={styles.boldText}>Sewing Machine 3</Text> within 5 days.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom nav hint */}
          <View style={styles.bottomNav}>
            <View style={styles.navBarActive} />
            <View style={styles.navBarDot} />
            <View style={styles.navBarDot} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7", // Light gray background from your design
    paddingTop: 40,
  },
  phoneFrame: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent", 
  },
  notchContainer: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 4,
  },
  notch: {
    width: 96,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.1)", // Darker notch for light background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    backgroundColor: "#1e3a8a", // Deep blue header background block from your image
    padding: 20,
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // White text inside the blue header
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)", // Light text for the count
    marginTop: 2,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#ffffff", // Pure white card backgrounds
    // Adds a soft mobile shadow to make cards pop off the light gray screen
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, 
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22, // Completely round icon bubbles like your image
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  machineName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937", // Dark gray/black text for readability
  },
  machineDetail: {
    fontSize: 13,
    color: "#6b7280", // Muted gray text for details
    marginTop: 2,
  },
  alertText: {
    color: "#dc2626", // Distinct red for error alerts
    fontWeight: "600",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8, // Rectangular rounded badges like the mockup
  },
  badgeDot: {
    display: "none", // Hidden dot to clean up the badge face
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  aiBanner: {
    marginTop: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#eff6ff", // Soft blue hint box background
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  aiIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  aiDescription: {
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: "#1e3a8a",
  },
  bottomNav: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  navBarActive: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563eb",
  },
  navBarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
});