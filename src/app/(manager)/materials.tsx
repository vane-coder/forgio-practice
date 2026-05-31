import { View, Text, StyleSheet } from "react-native";

export default function MaterialsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Materials</Text>
      {/* TODO: Build the Materials screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
});
