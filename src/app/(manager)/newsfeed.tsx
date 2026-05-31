import { View, Text, StyleSheet } from "react-native";

export default function NewsFeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NewsFeed</Text>
      {/* TODO: Build the NewsFeed screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1565C0", marginBottom: 16 },
});
