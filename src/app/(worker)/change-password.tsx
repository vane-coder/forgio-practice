import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function WorkerChangePasswordScreen() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change password</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={16} color="#1565C0" />
              <Text style={styles.infoText}>Your new password must be at least 8 characters long.</Text>
            </View>

            <Text style={styles.label}>Current password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={current} onChangeText={setCurrent} secureTextEntry={!showCurrent} placeholder="Enter current password" placeholderTextColor="#aaa" />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>New password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={newPass} onChangeText={setNewPass} secureTextEntry={!showNew} placeholder="Enter new password" placeholderTextColor="#aaa" />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm new password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} placeholder="Confirm new password" placeholderTextColor="#aaa" />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
              <Text style={styles.saveBtnText}>Update password</Text>
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
  body: { padding: 16 },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#E3F2FD", borderRadius: 10, padding: 12, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 12, color: "#0C447C", lineHeight: 17 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  passwordRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#e0e0e0", marginBottom: 16 },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: "#1A1A1A" },
  eyeBtn: { padding: 12 },
  saveBtn: { backgroundColor: "#1565C0", borderRadius: 10, padding: 14, alignItems: "center", marginTop: 8, marginBottom: 24 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
});