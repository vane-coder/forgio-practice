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

export default function EnterProductionScreen() {
  const router = useRouter();
  
  // State variables for form fields
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedShift, setSelectedShift] = useState('Morning');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!productName.trim() || !quantity.trim()) {
      Alert.alert('Missing Info', 'Please fill in the product name and quantity.');
      return;
    }
    
    Alert.alert(
      'Success', 
      `Production entry for "${productName}" submitted successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Configure navigation header visibility */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />

      {/* Top Banner Header Section */}
      <SafeAreaView style={styles.topBanner} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>Enter production</Text>
            <Text style={styles.headerSubtitle}>Monday, 28 April 2026</Text>
          </View>
          <TouchableOpacity style={styles.menuDotsButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Form Content Section */}
      <ScrollView 
        contentContainerStyle={styles.formContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input 1: Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Product name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Cotton shirt"
            placeholderTextColor="#94a3b8"
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        {/* Input 2: Quantity Produced */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quantity produced</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 120"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        {/* Input 3: Shift Pill Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Shift</Text>
          <View style={styles.shiftSelectorRow}>
            {['Morning', 'Afternoon', 'Night'].map((shift) => {
              const isSelected = selectedShift === shift;
              return (
                <TouchableOpacity
                  key={shift}
                  style={[
                    styles.shiftPill,
                    isSelected ? styles.shiftPillSelected : styles.shiftPillUnselected
                  ]}
                  onPress={() => setSelectedShift(shift)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.shiftPillText,
                    isSelected ? styles.shiftPillTextSelected : styles.shiftPillTextUnselected
                  ]}>
                    {shift}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Input 4: Notes (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            placeholder=""
            placeholderTextColor="#94a3b8"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Action Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit entry</Text>
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
    backgroundColor: '#1e40af', // Rich corporate blue matching home screen
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
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  menuDotsButton: {
    padding: 4,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#0f172a',
  },
  textAreaInput: {
    height: 110,
    paddingTop: 14,
    paddingBottom: 14,
  },
  shiftSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftPill: {
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  shiftPillSelected: {
    backgroundColor: '#1e40af',
  },
  shiftPillUnselected: {
    backgroundColor: '#e0f2fe',
  },
  shiftPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shiftPillTextSelected: {
    color: '#ffffff',
  },
  shiftPillTextUnselected: {
    color: '#0369a1',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});