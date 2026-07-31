import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { colors } from "../../constants/Colors";

export default function ChangePasswordScreen() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!current || !newPass || !confirm) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (newPass.length < 8) {
      Alert.alert("Too short", "New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Mismatch", "New password and confirmation don't match.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(`${API_BASE_URL}/profile/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
        });
        if (!res.ok) throw new Error("Change failed");
        Alert.alert("Success", "Your password has been updated.");
        router.back();
      }
    } catch (e) {
      Alert.alert("Failed", "Current password may be incorrect.");
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
            <Text style={styles.headerTitle}>Change password</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.infoText}>Your new password must be at least 8 characters long.</Text>
            </View>

            <Text style={styles.label}>Current password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={current} onChangeText={setCurrent} secureTextEntry={!showCurrent} placeholder="Enter current password" placeholderTextColor={colors.textMuted} />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>New password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={newPass} onChangeText={setNewPass} secureTextEntry={!showNew} placeholder="Enter new password" placeholderTextColor={colors.textMuted} />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm new password</Text>
            <View style={styles.passwordRow}>
              <TextInput style={styles.passwordInput} value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} placeholder="Confirm new password" placeholderTextColor={colors.textMuted} />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveBtnText}>Update password</Text>}
            </TouchableOpacity>

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
  body: { padding: 16 },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.blueTint, borderRadius: 10, padding: 12, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 12, color: colors.primary, lineHeight: 17 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  passwordRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, marginBottom: 16 },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: colors.textDark },
  eyeBtn: { padding: 12 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 8, marginBottom: 24 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
});