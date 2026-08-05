import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Keyboard,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  verifyAndRegister,
  verifyLogin,
  resetPassword,
  sendRegistrationCode,
  login as loginApi,
  forgotPassword,
} from "../../services/auth.service";
import { saveToken } from "../../auth";
import { colors } from "../../constants/Colors";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

type OtpFlow = "registration" | "login" | "password-reset";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{
    flow: OtpFlow;
    phone: string;
    email?: string;
    verificationId: string;
    managerName?: string;
    password?: string;
    factoryName?: string;
    location?: string;
    industry?: string;
  }>();

  const { flow, phone, email, managerName, password, factoryName, location, industry } = params;
  const [verificationId, setVerificationId] = useState(params.verificationId);
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, CODE_LENGTH).split("");
      const next = [...code];
      digits.forEach((d, i) => {
        if (index + i < CODE_LENGTH) next[index + i] = d;
      });
      setCode(next);
      const focusIdx = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputs.current[focusIdx]?.focus();
      return;
    }

    const next = [...code];
    next[index] = text.replace(/\D/g, "");
    setCode(next);

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      const next = [...code];
      next[index - 1] = "";
      setCode(next);
      inputs.current[index - 1]?.focus();
    }
  };

  const fullCode = code.join("");

  const handleVerify = async () => {
    if (fullCode.length < CODE_LENGTH) {
      Alert.alert("Incomplete code", "Please enter the full 6-digit code.");
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (flow === "registration") {
        const res = await verifyAndRegister({
          phone,
          email: email!,
          code: fullCode,
          managerName: managerName!,
          password: password!,
          factoryName: factoryName!,
          location,
          industry,
        });
        await saveToken(res.accessToken);
        router.replace("/(manager)/dashboard");
      } else if (flow === "login") {
        const res = await verifyLogin(phone, fullCode, verificationId);
        await saveToken(res.accessToken);
        if (res.role === "MANAGER") router.replace("/(manager)/dashboard");
        else if (res.role === "DEPT_HEAD") router.replace("/(worker)/home");
        else if (res.role === "DRIVER") router.replace("/(driver)/home" as any);
      } else if (flow === "password-reset") {
        router.push({
          pathname: "/(auth)/reset-password",
          params: { phone, code: fullCode },
        });
      }
    } catch (e: any) {
      Alert.alert("Verification failed", e.message || "Invalid code. Please try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      let newId: string | null = null;
      if (flow === "registration") {
        const res = await sendRegistrationCode(phone, email!);
        newId = res.verificationId;
      } else if (flow === "login") {
        const res = await loginApi(phone, password!);
        newId = res.verificationId;
      } else if (flow === "password-reset") {
        const res = await forgotPassword(phone);
        newId = res.verificationId;
      }
      if (newId) setVerificationId(newId);
      setResendTimer(RESEND_COOLDOWN);
      setCode(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
      Alert.alert("Code resent", "A new verification code has been sent.");
    } catch (e: any) {
      Alert.alert("Resend failed", e.message || "Could not resend code. Please try again.");
    }
  };

  const flowTitle: Record<OtpFlow, string> = {
    registration: "Verify your account",
    login: "Two-step verification",
    "password-reset": "Verify your identity",
  };

  const flowSubtitle: Record<OtpFlow, string> = {
    registration: `We sent a 6-digit code to ${email || phone}. Enter it below to complete your registration.`,
    login: `We sent a 6-digit code to your phone or email. Enter it to sign in.`,
    "password-reset": `We sent a 6-digit code to ${phone}. Enter it to reset your password.`,
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
            <Ionicons name="shield-checkmark-outline" size={36} color={colors.primary} />
          </View>

          <Text style={styles.title}>{flowTitle[flow as OtpFlow]}</Text>
          <Text style={styles.subtitle}>{flowSubtitle[flow as OtpFlow]}</Text>

          <View style={styles.codeRow}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(r) => { inputs.current[i] = r; }}
                style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={i === 0 ? CODE_LENGTH : 1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyBtn, fullCode.length < CODE_LENGTH && styles.verifyBtnDisabled]}
            onPress={handleVerify}
            disabled={loading || fullCode.length < CODE_LENGTH}
          >
            <Text style={styles.verifyBtnText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>
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
  subtitle: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: 32 },
  codeRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 32, gap: 8,
  },
  codeInput: {
    flex: 1, height: 56, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, textAlign: "center", fontSize: 22, fontWeight: "700",
    color: colors.textDark, backgroundColor: colors.background,
  },
  codeInputFilled: { borderColor: colors.accent, backgroundColor: colors.accentLight },
  verifyBtn: {
    backgroundColor: colors.accent, padding: 16,
    borderRadius: 10, alignItems: "center", marginBottom: 20,
  },
  verifyBtnDisabled: { opacity: 0.5 },
  verifyBtnText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  resendText: { fontSize: 13, color: colors.textMuted },
  resendTimer: { fontSize: 13, color: "#aaa" },
  resendLink: { fontSize: 13, color: colors.accent, fontWeight: "600" },
});