import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert // Imported Alert to handle both actions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function ReportBreakdownScreen() {
  const [selectedMachine, setSelectedMachine] = useState('Sewing Machine 3');
  const [problemDescription, setProblemDescription] = useState('');
  const [stopTime, setStopTime] = useState('');

  const machineOptions = ['Sewing Machine 1', 'Sewing Machine 2', 'Sewing Machine 3', 'Cutting Machine 1'];

  const handleSelectMachine = () => {
    Alert.alert(
      "Select Machine",
      "Choose a machine from the list:",
      machineOptions.map(machine => ({
        text: machine,
        onPress: () => setSelectedMachine(machine)
      })),
      { cancelable: true }
    );
  };

  // This function now handles the button submission visually
  const handleReportSubmit = () => {
    if (!problemDescription.trim() || !stopTime.trim()) {
      Alert.alert("Missing Details", "Please fill out what happened and when it stopped.");
      return;
    }

    // Show visual confirmation toast/alert to the user
    Alert.alert(
      "Breakdown Reported",
      `Successfully logged issue for ${selectedMachine}.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Clean/Reset the inputs after clicking OK
            setProblemDescription('');
            setStopTime('');
            setSelectedMachine('Sewing Machine 3');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0D21A1" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report breakdown</Text>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Form Body */}
      <View style={styles.formContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Select Machine Dropdown Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select machine</Text>
              <TouchableOpacity 
                style={styles.dropdownField} 
                activeOpacity={0.6}
                onPress={handleSelectMachine}
              >
                <Text style={styles.dropdownText}>{selectedMachine}</Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Problem Description Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>What happened?</Text>
              <TextInput
                style={[styles.inputField, styles.textArea]}
                placeholder="Describe the problem..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={4}
                value={problemDescription}
                onChangeText={setProblemDescription}
                textAlignVertical="top"
              />
            </View>

            {/* Stop Time Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>When did it stop?</Text>
              <TextInput
                style={styles.inputField}
                placeholder="e.g. 10:30 AM"
                placeholderTextColor="#94A3B8"
                value={stopTime}
                onChangeText={setStopTime}
              />
            </View>

            {/* Submit Button - NOW ACTIVE */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleReportSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Report breakdown</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#0D21A1', 
  },
  header: {
    backgroundColor: '#0D21A1', 
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  moreButton: {
    padding: 4,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA', 
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#334155',
    backgroundColor: '#FFF',
  },
  dropdownField: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    height: 130,
    paddingTop: 14,
  },
  submitButton: {
    backgroundColor: '#BA1A3F', 
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});