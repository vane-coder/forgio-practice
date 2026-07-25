import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getToken } from "../../auth";
import { updateShipmentStatus } from "../../services/shipment.service";

const steps = [
  { key: "PENDING", label: "Pending", icon: "time-outline", desc: "Shipment assigned, not yet departed" },
  { key: "DEPARTED", label: "Departed", icon: "car-outline", desc: "Left pickup location" },
  { key: "IN_TRANSIT", label: "In transit", icon: "navigate-outline", desc: "On the way to destination" },
  { key: "ARRIVED", label: "Arrived", icon: "checkmark-circle-outline", desc: "Delivered to destination" },
];

export default function UpdateStatusScreen() {
  const params = useLocalSearchParams<{ shipmentId?: string; status?: string }>();
  const [current, setCurrent] = useState(params.status || "PENDING");
  const [saving, setSaving] = useState(false);
  const currentIndex = steps.findIndex((s) => s.key === current);

  const advance = async (nextKey: string) => {
    if (!params.shipmentId) {
      Alert.alert("Missing shipment", "No shipment selected.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await updateShipmentStatus(token, params.shipmentId, nextKey);
        setCurrent(nextKey);
      }
    } catch (e) {
      Alert.alert("Failed", "Could not update status.");
    } finally { setSaving(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update status</Text>
            {params.shipmentId ? (
              <Text style={styles.headerSub}>#{params.shipmentId.substring(0, 8)}</Text>
            ) : null}
          </View>

          <View style={styles.body}>
            {steps.map((step, index) => {
              const isDone = index < currentIndex;
              const isActive = step.key === current;
              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepIconCol}>
                    <View style={[
                      styles.stepCircle,
                      isDone && { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
                      isActive && { backgroundColor: "#1565C0", borderColor: "#1565C0" },
                    ]}>
                      <Ionicons
                        name={isDone ? "checkmark" : step.icon as any}
                        size={16}
                        color={isDone || isActive ? "#fff" : "#ccc"}
                      />
                    </View>
                    {index < steps.length - 1 && (
                      <View style={[styles.stepLine, isDone && { backgroundColor: "#2E7D32" }]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepLabel,
                      isActive && { color: "#1565C0" },
                      isDone && { color: "#2E7D32" }
                    ]}>
                      {step.label}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                    {isActive && index < steps.length - 1 && (
                      <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => advance(steps[index + 1].key)}
                        disabled={saving}
                      >
                        {saving ? (
                          <ActivityIndicator size="small" color="#1565C0" />
                        ) : (
                          <>
                            <Text style={styles.nextBtnText}>Mark as {steps[index + 1].label}</Text>
                            <Ionicons name="arrow-forward" size={14} color="#1565C0" />
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                    {step.key === "ARRIVED" && isActive && (
                      <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => router.push("/(driver)/shipment-assignment")}
                      >
                        <Text style={styles.doneBtnText}>Done</Text>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
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
  body: { padding: 20 },
  stepRow: { flexDirection: "row", gap: 14, marginBottom: 4 },
  stepIconCol: { alignItems: "center" },
  stepCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: "#ccc", backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  stepLine: { width: 2, height: 50, backgroundColor: "#e0e0e0", marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepLabel: { fontSize: 16, fontWeight: "500", color: "#888", marginBottom: 3 },
  stepDesc: { fontSize: 11, color: "#aaa" },
  nextBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#E3F2FD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, alignSelf: "flex-start" },
  nextBtnText: { fontSize: 12, color: "#1565C0", fontWeight: "500" },
  doneBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#2E7D32", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, alignSelf: "flex-start" },
  doneBtnText: { fontSize: 12, color: "#fff", fontWeight: "500" },
});