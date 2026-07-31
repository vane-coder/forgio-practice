import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendRegistrationCode } from "../../services/auth.service";
import { colors } from "../../constants/Colors";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [factoryName, setFactoryName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password || !factoryName) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await sendRegistrationCode(phone);
      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          flow: "registration",
          phone,
          verificationId: res.verificationId ?? "",
          managerName: name,
          password,
          factoryName,
        },
      });
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not send verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join Forgio and start managing your factory</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput style={styles.input} placeholder="e.g. Vanessa Oware" value={name} onChangeText={setName} />

      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} placeholder="e.g. 0244000000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Factory name</Text>
      <TextInput style={styles.input} placeholder="e.g. Kate Best Company Ltd" value={factoryName} onChangeText={setFactoryName} />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending code..." : "Create account"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: 24 },
  header: { marginTop: 10, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: colors.textDark, marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 28, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 8, fontSize: 14, color: colors.textDark, backgroundColor: colors.background },
  passwordRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 10, marginBottom: 16, backgroundColor: colors.background },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: colors.textDark },
  eyeBtn: { padding: 12 },
  button: { backgroundColor: colors.accent, padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 16 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  loginLink: { alignItems: "center", marginBottom: 40 },
  loginLinkText: { fontSize: 13, color: colors.textMuted },
  loginLinkBold: { color: colors.primary, fontWeight: "500" },
});
