import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");

  const handleLogin = async () => {
    // TODO: call auth.service.ts login function when backend is ready
    // For now navigate based on selected role
    if (role === "MANAGER") router.replace("/(manager)/dashboard");
    if (role === "WORKER") router.replace("/(worker)/home");
    if (role === "DRIVER") router.replace("/(driver)/shipment-assignment");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgio</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Temporary role selector — remove when backend is ready */}
      <Text style={styles.roleLabel}>Login as (temporary)</Text>
      <View style={styles.roleRow}>
        {["MANAGER", "WORKER", "DRIVER"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, role === r && styles.roleBtnActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", color: "#1565C0", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  roleLabel: { fontSize: 13, fontWeight: "500", color: "#888", marginBottom: 10 },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  roleBtn: { flex: 1, borderRadius: 8, padding: 10, alignItems: "center", backgroundColor: "#F5F5F5", borderWidth: 0.5, borderColor: "#e0e0e0" },
  roleBtnActive: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  roleBtnText: { fontSize: 13, color: "#888" },
  roleBtnTextActive: { color: "#fff", fontWeight: "500" },
  button: { backgroundColor: "#1565C0", padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});