import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { getToken } from "../auth";
import { API_BASE_URL } from "../services/api.config";
import { colors } from "../constants/Colors";

type Dest =
  | "/welcome"
  | "/(manager)/dashboard"
  | "/(worker)/home"
  | "/(driver)/home";

export default function Index() {
  const [dest, setDest] = useState<Dest | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) { setDest("/welcome"); return; }
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setDest("/welcome"); return; }
        const data = await res.json();
        if (data.role === "MANAGER" || data.role === "SYSTEM_ADMIN") setDest("/(manager)/dashboard");
        else if (data.role === "DRIVER") setDest("/(driver)/home");
        else setDest("/(worker)/home");
      } catch {
        setDest("/welcome");
      }
    })();
  }, []);

  if (!dest) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={dest as any} />;
}
