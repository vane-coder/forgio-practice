import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1565C0" />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={36} color="#1565C0" />
          </View>

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter the email address linked to your Forgio account and we will send you a reset link.
          </Text>

          {!sent ? (
            <>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity style={styles.sendBtn} onPress={() => setSent(true)}>
                <Text style={styles.sendBtnText}>Send reset link</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={40} color="#2E7D32" />
              <Text style={styles.successTitle}>Email sent!</Text>
              <Text style={styles.successText}>
                Check your inbox at {email} for a password reset link.
              </Text>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(auth)/login")}>
                <Text style={styles.backBtnText}>Back to login</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLinkText}>Remembered it? <Text style={styles.loginLinkBold}>Sign in</Text></Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingTop: 16 },
  body: { flex: 1, paddingHorizontal: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#E3F2FD", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A", marginBottom: 10 },
  subtitle: { fontSize: 13, color: "#888", lineHeight: 20, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "500", color: "#1A1A1A", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, padding: 12, fontSize: 14, color: "#1A1A1A", backgroundColor: "#F5F7FA", marginBottom: 20 },
  sendBtn: { backgroundColor: "#1565C0", borderRadius: 10, padding: 16, alignItems: "center", marginBottom: 16 },
  sendBtnText: { fontSize: 15, fontWeight: "bold", color: "#fff" },
  successCard: { alignItems: "center", gap: 10, backgroundColor: "#E8F5E9", borderRadius: 12, padding: 24, marginBottom: 20 },
  successTitle: { fontSize: 18, fontWeight: "500", color: "#2E7D32" },
  successText: { fontSize: 13, color: "#444", textAlign: "center", lineHeight: 19 },
  backBtn: { backgroundColor: "#2E7D32", borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  backBtnText: { fontSize: 14, fontWeight: "500", color: "#fff" },
  loginLink: { alignItems: "center", marginTop: 10 },
  loginLinkText: { fontSize: 13, color: "#888" },
  loginLinkBold: { color: "#1565C0", fontWeight: "500" },
});