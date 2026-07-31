import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { login } from "../../services/auth.service";
import { colors } from "../../constants/Colors";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Missing fields", "Please enter your phone number and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await login(phone, password);
      if (res.otpRequired) {
        (router as any).push({
          pathname: "/(auth)/verify-otp",
          params: {
            flow: "login",
            phone,
            password,
            verificationId: res.verificationId,
          },
        });
      }
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Check your phone number and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgio</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoCapitalize="none"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotLink}
        onPress={() => router.push("/(auth)/forgot-password")}
      >
        <Text style={styles.forgotLinkText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.registerLinkText}>
          No account? <Text style={styles.registerLinkBold}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.white },
  title: { fontSize: 32, fontWeight: "bold", color: colors.primary, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: "center", marginBottom: 32 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  passwordWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 16 },
  passwordInput: { flex: 1, padding: 12, fontSize: 16 },
  eyeButton: { paddingHorizontal: 12, paddingVertical: 12 },
  forgotLink: { alignSelf: "flex-end", marginBottom: 16 },
  forgotLinkText: { fontSize: 13, color: colors.primary, fontWeight: "500" },
  button: { backgroundColor: colors.accent, padding: 16, borderRadius: 8, alignItems: "center" },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  registerLink: { alignItems: "center", marginTop: 16 },
  registerLinkText: { fontSize: 13, color: colors.textMuted },
  registerLinkBold: { color: colors.primary, fontWeight: "500" },
});
