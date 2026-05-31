import { View, Text, StyleSheet } from "react-native";

export default function PermissionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      {/* TODO: Build the Permissions screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
});
