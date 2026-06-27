import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { register } from "../../services/auth.service";
import { saveToken } from "../../auth";

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
    setLoading(true);
    try {
      const res = await register({
        managerName: name,
        phone,
        password,
        factoryName,
      });
      await saveToken(res.accessToken);
      // a new registration is always a manager (creates the factory)
      router.replace("/(manager)/dashboard");
    } catch (e) {
      Alert.alert("Registration failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1565C0" />
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
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text></Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  header: { marginTop: 10, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1A1A1A", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#888", marginBottom: 28, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, padding: 12, marginBottom: 8, fontSize: 14, color: "#1A1A1A", backgroundColor: "#F5F7FA" },
  passwordRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, marginBottom: 16, backgroundColor: "#F5F7FA" },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: "#1A1A1A" },
  eyeBtn: { padding: 12 },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  roleBtn: { flex: 1, borderRadius: 8, padding: 10, alignItems: "center", backgroundColor: "#F5F5F5", borderWidth: 0.5, borderColor: "#e0e0e0" },
  roleBtnActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  roleBtnText: { fontSize: 13, color: "#888" },
  roleBtnTextActive: { color: "#fff", fontWeight: "500" },
  button: { backgroundColor: "#1565C0", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginLink: { alignItems: "center", marginBottom: 40 },
  loginLinkText: { fontSize: 13, color: "#888" },
  loginLinkBold: { color: "#1565C0", fontWeight: "500" },
});