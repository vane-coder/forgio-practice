import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { getToken } from "../../auth";
import { API_BASE_URL } from "../../services/api.config";

export default function ShipmentTrackScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const [points, setPoints] = useState<{ latitude: number; longitude: number }[]>([]);

  const loadTrack = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/track`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setPoints(await res.json());
  }, [shipmentId]);

  useFocusEffect(useCallback(() => { loadTrack(); }, [loadTrack]));
  useEffect(() => {
    const interval = setInterval(loadTrack, 10000); // refresh every 10s while screen is open
    return () => clearInterval(interval);
  }, [loadTrack]);

  const last = points[points.length - 1];
  const html = `
    <!DOCTYPE html><html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>html,body,#map{height:100%;margin:0;padding:0}</style>
    </head><body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const points = ${JSON.stringify(points.map(p => [p.latitude, p.longitude]))};
        const start = points.length ? points[points.length - 1] : [5.6037, -0.1870]; // Accra fallback
        const map = L.map('map').setView(start, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        if (points.length) {
          L.polyline(points, { color: '#1D4ED8' }).addTo(map);
          L.marker(points[points.length - 1]).addTo(map).bindPopup('Current location').openPopup();
        }
      </script>
    </body></html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={{ html }} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });