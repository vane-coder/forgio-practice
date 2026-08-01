import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../constants/Colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}

export default function Button({ title, onPress, variant = "primary" }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "outline" && styles.outline]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === "outline" && styles.outlineText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: "center" },
  outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.primary },
  text: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  outlineText: { color: colors.primary },
});
