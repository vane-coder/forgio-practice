import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/Colors";

interface MapViewProps {
  latitude?: number;
  longitude?: number;
}

export default function ForwardMapView({ latitude, longitude }: MapViewProps) {
  // TODO: Integrate Google Maps API here
  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>
        Map View{latitude ? ` — ${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` : " — Loading..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { height: 300, backgroundColor: colors.primaryLight, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  text: { color: colors.primary, fontSize: 14 },
});
