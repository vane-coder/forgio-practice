import React from "react";
import {
    View, Text, StyleSheet,
    TouchableOpacity, Image, Dimensions
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/Colors";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>

                {/* Top section — blue background */}
                <View style={styles.top}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="business" size={40} color={colors.white} />
                    </View>
                    <Text style={styles.appName}>Forgio</Text>
                    <Text style={styles.tagline}>Know More. Waste Less. Grow Faster.</Text>
                </View>

                {/* Bottom section — white card */}
                <View style={styles.bottom}>
                    <Text style={styles.welcomeTitle}>Welcome!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Manage your factory smarter — track production, machines, materials, and deliveries all in one place.
                    </Text>

                    {/* Sign up button */}
                    <TouchableOpacity
                        style={styles.signUpBtn}
                        onPress={() => router.push("/(auth)/register")}
                    >
                        <Text style={styles.signUpBtnText}>Create an account</Text>
                    </TouchableOpacity>

                    {/* Login button */}
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={styles.loginBtnText}>I already have an account</Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By continuing you agree to our{" "}
                        <Text style={styles.termsLink}>Terms of Service</Text>
                        {" "}and{" "}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    // Top blue section
    top: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "bold",
        color: colors.white,
    },
    appName: {
        fontSize: 36,
        fontWeight: "bold",
        color: colors.white,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 13,
        color: colors.headerSubtitle,
        textAlign: "center",
        paddingHorizontal: 40,
    },

    // Bottom white section
    bottom: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 28,
        paddingTop : 50,
        paddingBottom: 36,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.textDark,
        marginBottom: 10,
    },
    welcomeSubtitle: {
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 20,
        marginBottom: 28,
    },
    signUpBtn: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 12,
    },
    signUpBtnText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white,
    },
    loginBtn: {
        backgroundColor: colors.blueTint,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    loginBtnText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.primary,
    },
    termsText: {
        fontSize: 11,
        color: colors.textMuted,
        textAlign: "center",
        lineHeight: 18,
    },
    termsLink: {
        color: colors.primary,
    },
});