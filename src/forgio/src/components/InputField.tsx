import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
}

export default function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType = "default" }: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, color: Colors.grey, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 12, fontSize: 16 },
});
