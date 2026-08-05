import React, { useState ,useCallback} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams ,useFocusEffect} from "expo-router";
import { getToken } from "../../auth";
import { updateShipmentStatus } from "../../services/shipment.service";
import { colors } from "../../constants/Colors";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
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
                      isDone && { backgroundColor: colors.success, borderColor: colors.success },
                      isActive && { backgroundColor: colors.accent, borderColor: colors.accent },
                    ]}>
                      <Ionicons
                        name={isDone ? "checkmark" : step.icon as any}
                        size={16}
                        color={isDone || isActive ? colors.white : colors.border}
                      />
                    </View>
                    {index < steps.length - 1 && (
                      <View style={[styles.stepLine, isDone && { backgroundColor: colors.success }]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepLabel,
                      isActive && { color: colors.accent },
                      isDone && { color: colors.success }
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
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <>
                            <Text style={styles.nextBtnText}>Mark as {steps[index + 1].label}</Text>
                            <Ionicons name="arrow-forward" size={14} color={colors.white} />
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
                        <Ionicons name="checkmark" size={14} color={colors.white} />
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 20 },
  stepRow: { flexDirection: "row", gap: 14, marginBottom: 4 },
  stepIconCol: { alignItems: "center" },
  stepCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, justifyContent: "center", alignItems: "center" },
  stepLine: { width: 2, height: 50, backgroundColor: colors.border, marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepLabel: { fontSize: 16, fontWeight: "500", color: colors.textMuted, marginBottom: 3 },
  stepDesc: { fontSize: 11, color: colors.textMuted },
  nextBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, alignSelf: "flex-start" },
  nextBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
  doneBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.success, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10, alignSelf: "flex-start" },
  doneBtnText: { fontSize: 12, color: colors.white, fontWeight: "500" },
});