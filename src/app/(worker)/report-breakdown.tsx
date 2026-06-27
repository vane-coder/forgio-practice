import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const machines = [
  { id: 1, name: "Cutting Machine 1" },
  { id: 2, name: "Sewing Machine 3" },
  { id: 3, name: "Packaging Unit 2" },
];

export default function ReportBreakdownScreen() {
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selected = machines.find((m) => m.id === selectedMachine);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report breakdown</Text>
            <Text style={styles.headerSub}>Let the manager know immediately</Text>
          </View>

          <View style={styles.body}>

            <Text style={styles.label}>Select machine</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={[styles.dropdownText, !selected && { color: "#aaa" }]}>
                {selected ? selected.name : "Choose a machine..."}
              </Text>
              <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#888" />
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownList}>
                {machines.map((m, i) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.dropdownItem, i === machines.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => { setSelectedMachine(m.id); setShowDropdown(false); }}
                  >
                    <Text style={[styles.dropdownItemText, selectedMachine === m.id && { color: "#1565C0", fontWeight: "500" }]}>
                      {m.name}
                    </Text>
                    {selectedMachine === m.id && <Ionicons name="checkmark" size={16} color="#1565C0" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>What happened?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the problem..."
              placeholderTextColor="#aaa"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>When did it stop?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10:30 AM"
              placeholderTextColor="#aaa"
              value={time}
              onChangeText={setTime}
            />

            <TouchableOpacity
              style={styles.reportBtn}
              onPress={() => router.push("/(worker)/home")}
            >
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.reportBtnText}>Report breakdown</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

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
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  dropdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, marginBottom: 4 },
  dropdownText: { fontSize: 14, color: "#1A1A1A" },
  dropdownList: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  dropdownItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  dropdownItemText: { fontSize: 13, color: "#1A1A1A" },
  textArea: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 13, color: "#1A1A1A", minHeight: 100, textAlignVertical: "top", marginBottom: 16 },
  input: { backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 12, fontSize: 14, color: "#1A1A1A", marginBottom: 20 },
  reportBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#C62828", borderRadius: 10, padding: 14, marginBottom: 10 },
  reportBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  cancelBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 24 },
  cancelBtnText: { fontSize: 14, color: "#888", fontWeight: "500" },
});