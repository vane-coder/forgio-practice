import { View, Text, StyleSheet } from "react-native";

export default function ShipmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shipments</Text>
      {/* TODO: Build the Shipments screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
});
