import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../../constants/Colors";

export default function MarketplaceCheckoutScreen() {
  const { authorizationUrl } = useLocalSearchParams<{ authorizationUrl: string }>();
  const [loading, setLoading] = useState(true);
  const decodedUrl = decodeURIComponent(authorizationUrl);

  const handleShouldStartLoad = (request: { url: string }) => {
    if (request.url.startsWith("forgio://payment-result")) {
      const url = new URL(request.url.replace("forgio://", "https://dummy/"));
      const status = url.searchParams.get("status");
      router.replace("/(manager)/marketplace");
      setTimeout(() => {
        if (status === "success") {
          Alert.alert("Payment successful", "The goods have been added to your warehouse.");
        } else {
          Alert.alert("Payment failed", "The transaction was not completed.");
        }
      }, 300);
      return false;
    }
    return true;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {Platform.OS === "web" ? (
          <iframe src={decodedUrl} style={{ flex: 1, border: "none", width: "100%", height: "100%" }} onLoad={() => setLoading(false)} />
        ) : (
          <WebView
            source={{ uri: decodedUrl }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, zIndex: 1 },
});