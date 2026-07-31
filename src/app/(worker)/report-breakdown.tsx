import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { getMachines, reportBreakdown } from "../../services/machines.service";
import { colors } from "../../constants/Colors";

export default function ReportBreakdownScreen() {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getMachines(token);
          setMachines(Array.isArray(data) ? data : []);
        }
      } catch (e) { console.log("machines load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const selected = machines.find((m) => m.machineId === selectedMachine);

  const handleReport = async () => {
    if (!selectedMachine) { Alert.alert("Missing", "Please select a machine."); return; }
    if (!description.trim()) { Alert.alert("Missing", "Please describe the problem."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await reportBreakdown(token, {
          machineId: selectedMachine,
          description: `${description.trim()}${time ? ` (stopped at ${time.trim()})` : ""}`,
        });
        Alert.alert("Reported", "Breakdown has been reported to the manager.");
        router.push("/(worker)/home");
      }
    } catch { Alert.alert("Error", "Failed to report breakdown."); }
    finally { setSaving(false); }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report breakdown</Text>
            <Text style={styles.headerSub}>Let the manager know immediately</Text>
          </View>

          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} />
            ) : (
              <>
                <Text style={styles.label}>Select machine</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
                  <Text style={[styles.dropdownText, !selected && { color: colors.textMuted }]}>
                    {selected ? selected.name : "Choose a machine..."}
                  </Text>
                  <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
                </TouchableOpacity>

                {showDropdown && (
                  <View style={styles.dropdownList}>
                    {machines.map((m, i) => (
                      <TouchableOpacity
                        key={m.machineId}
                        style={[styles.dropdownItem, i === machines.length - 1 && { borderBottomWidth: 0 }]}
                        onPress={() => { setSelectedMachine(m.machineId); setShowDropdown(false); }}
                      >
                        <Text style={[styles.dropdownItemText, selectedMachine === m.machineId && { color: colors.accent, fontWeight: "500" }]}>
                          {m.name}
                        </Text>
                        {selectedMachine === m.machineId && <Ionicons name="checkmark" size={16} color={colors.accent} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.label}>What happened?</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe the problem..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>When did it stop?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 10:30 AM"
                  placeholderTextColor={colors.textMuted}
                  value={time}
                  onChangeText={setTime}
                />

                <TouchableOpacity style={styles.reportBtn} onPress={handleReport} disabled={saving}>
                  {saving ? <ActivityIndicator color={colors.white} /> : (
                    <>
                      <Ionicons name="alert-circle-outline" size={18} color={colors.white} />
                      <Text style={styles.reportBtnText}>Report breakdown</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: "500", color: colors.white },
  headerSub: { fontSize: 11, color: colors.headerSubtitle, marginTop: 2 },
  body: { padding: 16 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, marginBottom: 4 },
  dropdownText: { fontSize: 14, color: colors.textDark },
  dropdownList: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, overflow: "hidden", marginBottom: 16 },
  dropdownItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  dropdownItemText: { fontSize: 13, color: colors.textDark },
  textArea: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 13, color: colors.textDark, minHeight: 100, textAlignVertical: "top", marginBottom: 16 },
  input: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 14, color: colors.textDark, marginBottom: 20 },
  reportBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.danger, borderRadius: 10, padding: 14, marginBottom: 10 },
  reportBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: colors.textMuted, fontWeight: "500" },
});
