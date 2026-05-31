import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: Colors.error, borderRadius: 10, minWidth: 20, height: 20, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  text: { color: Colors.white, fontSize: 12, fontWeight: "bold" },
});
