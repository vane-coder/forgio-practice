import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { colors } from "../../constants/Colors";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [factory, setFactory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const p = await res.json();
          setName(p.name || "");
          setPhone(p.phone || "");
          setFactory(p.factoryName || "");
        }
      } catch (e) { console.log("edit-profile load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing fields", "Name and phone are required.");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        });
        if (!res.ok) throw new Error("Update failed");
        Alert.alert("Saved", "Your profile was updated.");
        router.back();
      }
    } catch (e) {
      Alert.alert("Failed", "Could not update profile.");
    } finally { setSaving(false); }
  };

  const initials = (name || "?").split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.white} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit profile</Text>
          </View>

          <View style={styles.body}>

            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>

            <Text style={styles.label}>Full name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Phone number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <Text style={styles.label}>Factory name</Text>
            <TextInput style={[styles.input, { color: colors.textMuted }]} value={factory} editable={false} />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save changes"}</Text>
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
  avatarSection: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 26, fontWeight: "bold", color: colors.white },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 14, color: colors.textDark },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, padding: 16, alignItems: "center", marginTop: 24, marginBottom: 30 },
  saveBtnText: { color: colors.white, fontSize: 15, fontWeight: "500" },
});