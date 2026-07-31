import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";
import { colors } from "../../constants/Colors";

export default function WorkerEditProfileScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetch(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setName(data.name ?? "");
            setPhone(data.phone ?? "");
          }
        }
      } catch (e) { console.log("profile load failed", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) { Alert.alert("Missing fields", "Name and phone are required."); return; }
    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
        });
        if (!res.ok) throw new Error();
        Alert.alert("Saved", "Profile updated.");
        router.back();
      }
    } catch { Alert.alert("Error", "Failed to save profile."); }
    finally { setSaving(false); }
  };

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
            {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} /> : (
              <>
                <View style={styles.avatarSection}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials || "?"}</Text>
                  </View>
                </View>
                <Text style={styles.label}>Full name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
                <Text style={styles.label}>Phone number</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveBtnText}>Save changes</Text>}
                </TouchableOpacity>
              </>
            )}
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
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 28, fontWeight: "bold", color: colors.headerSubtitle },
  label: { fontSize: 13, fontWeight: "500", color: colors.textDark, marginBottom: 8 },
  input: { backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 12, fontSize: 14, color: colors.textDark, marginBottom: 16 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 8, marginBottom: 24 },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: colors.white },
});
