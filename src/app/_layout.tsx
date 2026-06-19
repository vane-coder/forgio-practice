import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Welcome screen — no header */}
      <Stack.Screen
        name="welcome"
        options={{ headerShown: false }}
      />

      {/* Auth screens — no header */}
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: false }}
      />

      {/* Manager screens — no header (we built our own) */}
      <Stack.Screen
        name="(manager)/dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/materials"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/machines"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/departments"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/permissions"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/notifications"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/newsfeed"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/reports"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/marketplace"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/branches"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/shipments"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/live-tracking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(manager)/ai-assistant"
        options={{ headerShown: false }}
      />

      {/* Worker screens */}
      <Stack.Screen
        name="(worker)/home"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(worker)/enter-production"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(worker)/record-material"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(worker)/report-breakdown"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(worker)/my-records"
        options={{ headerShown: false }}
      />

      {/* Driver screens */}
      <Stack.Screen
        name="(driver)/shipment-assignment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(driver)/update-status"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}