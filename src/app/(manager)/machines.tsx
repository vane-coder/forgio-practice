import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function MachinesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Machines</Text>
      {/* TODO: Build the Machines screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
});
