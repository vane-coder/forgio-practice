import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "../constants/Colors";

const PANEL_WIDTH = Math.min(300, Dimensions.get("window").width * 0.82);

type Item = { icon: keyof typeof Ionicons.glyphMap; label: string; route: string };

const items: Item[] = [
  { icon: "home-outline", label: "Dashboard", route: "/(driver)/home" },
  { icon: "cube-outline", label: "My shipment", route: "/(driver)/shipment-assignment" },
  { icon: "notifications-outline", label: "Notifications", route: "/(driver)/notifications" },
  { icon: "newspaper-outline", label: "News feed", route: "/(driver)/newsfeed" },
  { icon: "person-outline", label: "Profile", route: "/(driver)/profile" },
  { icon: "help-circle-outline", label: "Help & support", route: "/(driver)/help" },
];

export default function DriverSidebar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const slide = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  const go = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[styles.panel, { transform: [{ translateX: slide }] }]}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.item, i === items.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => go(item.route)}
              >
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.5)" },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  panel: { width: PANEL_WIDTH, backgroundColor: colors.white, height: "100%" },
  panelHeader: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  panelTitle: { fontSize: 18, fontWeight: "600", color: colors.white },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blueTint, justifyContent: "center", alignItems: "center" },
  itemLabel: { flex: 1, fontSize: 14, color: colors.textDark },
});
