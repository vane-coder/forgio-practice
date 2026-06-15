import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
// 1. Import SafeAreaView from this library instead of 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkerHomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.screenWrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />

      {/* Top Banner Profile Summary */}
      {/* 2. Using edges={['top']} here handles status bar spacing beautifully */}
      <SafeAreaView style={styles.topBanner} edges={['top']}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good morning</Text>
            <Text style={styles.profileName}>Vanessa Oware</Text>
            <Text style={styles.profileShift}>Cutting Dept · Morning shift</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>VO</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Grid Dashboard Options */}
      {/* 3. Using edges={['bottom', 'left', 'right']} handles screen notch clipping */}
      <SafeAreaView style={styles.bottomSection} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              {/* 1. Enter Production */}
              <TouchableOpacity 
                style={styles.gridCard} 
                onPress={() => router.push('./enter-production')}
              >
                <View style={styles.iconContainer}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Rect x="5" y="4" width="14" height="17" rx="2" ry="2" />
                    <Path d="M9 2h6v3H9z" />
                    <Line x1="9" y1="9" x2="15" y2="9" />
                    <Line x1="9" y1="13" x2="15" y2="13" />
                    <Line x1="9" y1="17" x2="13" y2="17" />
                  </Svg>
                </View>
                <Text style={styles.cardLabel}>Enter production</Text>
              </TouchableOpacity>

              {/* 2. Record Materials */}
              <TouchableOpacity 
                style={styles.gridCard} 
                onPress={() => Alert.alert('Coming Soon', 'Materials logging pipeline is being built.')}
              >
                <View style={styles.iconContainer}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <Path d="M2 17l10 5 10-5" />
                    <Path d="M2 12l10 5 10-5" />
                  </Svg>
                </View>
                <Text style={styles.cardLabel}>Record materials</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              {/* 3. Report Breakdown */}
              <TouchableOpacity 
                style={styles.gridCard} 
                onPress={() => Alert.alert('Breakdown Alert', 'Opening machine disruption log...')}
              >
                <View style={styles.iconContainer}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <Line x1="12" y1="9" x2="12" y2="13" />
                    <Line x1="12" y1="17" x2="12.01" y2="17" />
                  </Svg>
                </View>
                <Text style={styles.cardLabel}>Report breakdown</Text>
              </TouchableOpacity>

              {/* 4. My Records */}
              <TouchableOpacity 
                style={styles.gridCard} 
                onPress={() => router.push('./my-records')}
              >
                <View style={styles.iconContainer}>
                  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <Path d="M3 3v5h5" />
                    <Path d="M12 7v5l4 2" />
                  </Svg>
                </View>
                <Text style={styles.cardLabel}>My records</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Broadcast Feed Notification Card */}
          <TouchableOpacity 
            style={styles.notificationCard}
            onPress={() => router.push('./newsfeed')}
          >
            <Text style={styles.notificationTitle}>Latest notification</Text>
            <Text style={styles.notificationBody}>
              Team meeting today at 2PM in the assembly hall. Tap to see full announcement board.
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#f8fafc' },
  topBanner: { backgroundColor: '#1e40af', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  greetingText: { color: '#93c5fd', fontSize: 15, fontWeight: '500', opacity: 0.85 },
  profileName: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginTop: 1, letterSpacing: -0.3 },
  profileShift: { color: '#93c5fd', fontSize: 13, marginTop: 5, fontWeight: '500' },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1d4ed8', borderWidth: 1.5, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#ffffff', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  bottomSection: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  gridContainer: { width: '100%', marginBottom: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  gridCard: { backgroundColor: '#ffffff', width: '47.5%', aspectRatio: 0.95, borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', padding: 14, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1.5 },
  iconContainer: { height: 44, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  cardLabel: { color: '#334155', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 6, lineHeight: 18, paddingHorizontal: 4 },
  notificationCard: { backgroundColor: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 16, padding: 18, marginTop: 6 },
  notificationTitle: { color: '#0369a1', fontSize: 14, fontWeight: '700', marginBottom: 5, letterSpacing: -0.1 },
  notificationBody: { color: '#075985', fontSize: 14, lineHeight: 20, fontWeight: '500' },
});