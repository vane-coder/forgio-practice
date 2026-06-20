import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

// Simple lightweight custom box/package SVG icon to match your design style
const MaterialIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </Svg>
);

interface MaterialItem {
  id: string;
  name: string;
  stock: string;
  usage: string;
  unit: string;
}

export default function RecordMaterialsScreen() {
  const router = useRouter();

  // Initializing state with the mock data from your design image
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: '1', name: 'Cotton Fabric', stock: '48kg', usage: '12', unit: 'kg' },
    { id: '2', name: 'Thread', stock: '320kg', usage: '3', unit: 'kg' },
  ]);

  const handleUsageChange = (id: string, text: string) => {
    setMaterials(prev => 
      prev.map(item => item.id === id ? { ...item, usage: text } : item)
    );
  };

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Material usage logs saved successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleAddMaterial = () => {
    Alert.alert('Add Material', 'Material selection catalog pipeline is being built.');
  };

  return (
    <View style={styles.screenWrapper}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />

      {/* Top Banner Header Section */}
      <SafeAreaView style={styles.topBanner} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>Record materials used</Text>
          </View>
          <TouchableOpacity style={styles.menuDotsButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content Container */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Materials List */}
        <View style={styles.materialsList}>
          {materials.map((item, index) => (
            <View key={item.id} style={[
              styles.materialCard,
              index < materials.length - 1 && styles.cardDivider
            ]}>
              <View style={styles.leftRowSection}>
                <View style={styles.iconCircle}>
                  <MaterialIcon />
                </View>
                <View style={styles.metaWrapper}>
                  <Text style={styles.materialName}>{item.name}</Text>
                  <Text style={styles.stockText}>Stock: {item.stock}</Text>
                </View>
              </View>

              <View style={styles.rightRowSection}>
                <TextInput
                  style={styles.usageInput}
                  keyboardType="numeric"
                  value={item.usage}
                  onChangeText={(text) => handleUsageChange(item.id, text)}
                />
                <Text style={styles.unitText}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Dynamic Action Buttons */}
        <TouchableOpacity 
          style={styles.addMaterialButton} 
          onPress={handleAddMaterial}
          activeOpacity={0.7}
        >
          <Text style={styles.addMaterialText}>+ Add material</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save usage</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBanner: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTextWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  menuDotsButton: {
    padding: 4,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  materialsList: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  leftRowSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  metaWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  materialName: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  stockText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
  },
  rightRowSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  usageInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    width: 64,
    height: 40,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 10,
  },
  unitText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    width: 20,
  },
  addMaterialButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMaterialText: {
    color: '#1e40af',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1e40af',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});