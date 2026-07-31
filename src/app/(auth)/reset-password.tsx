import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../../services/auth.service";
import { colors } from "../../constants/Colors";

export default function ResetPasswordScreen() {
  const { phone, code } = useLocalSearchParams<{ phone: string; code: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Too short", "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(phone, code, newPassword);
      Alert.alert("Password reset", "Your password has been reset successfully.", [
        { text: "Sign in", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (e: any) {
      Alert.alert("Reset failed", e.message || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={36} color={colors.primary} />
          </View>

          <Text style={styles.title}>Set new password</Text>
          <Text style={styles.subtitle}>
            Choose a strong password for your Forgio account.
          </Text>

          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="At least 6 characters"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.resetBtn, (!newPassword || !confirmPassword) && styles.resetBtnDisabled]}
            onPress={handleReset}
            disabled={loading || !newPassword || !confirmPassword}
          >
            <Text style={styles.resetBtnText}>
              {loading ? "Resetting..." : "Reset password"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { padding: 20, paddingTop: 16 },
  body: { flex: 1, paddingHorizontal: 24 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.blueTint,
    justifyContent: "center", alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: colors.textDark, marginBottom: 10 },
  subtitle: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  passwordRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    marginBottom: 16, backgroundColor: colors.background,
  },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: colors.textDark },
  eyeBtn: { padding: 12 },
  resetBtn: {
    backgroundColor: colors.accent, padding: 16,
    borderRadius: 10, alignItems: "center", marginTop: 8,
  },
  resetBtnDisabled: { opacity: 0.5 },
  resetBtnText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
});
