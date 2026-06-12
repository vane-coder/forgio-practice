import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DepartmentsScreen() {
  return (
    <View style={styles.mainWrapper}>
      {/* --- BLUE HEADER BAR --- */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Departments</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* --- CUTTING DEPARTMENT CARD --- */}
        <View style={styles.departmentCard}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.departmentName}>Cutting</Text>
              <Text style={styles.headText}>Head: Attuah Jessica</Text>
            </View>
            <View style={styles.workerBadge}>
              <Text style={styles.workerText}>12 workers</Text>
            </View>
          </View>
        </View>

        {/* --- ASSEMBLY DEPARTMENT CARD --- */}
        <View style={styles.departmentCard}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.departmentName}>Assembly</Text>
              <Text style={styles.headText}>Head: Apoasan Akologo</Text>
            </View>
            <View style={styles.workerBadge}>
              <Text style={styles.workerText}>18 workers</Text>
            </View>
          </View>
        </View>

        {/* --- PACKAGING DEPARTMENT CARD --- */}
        <View style={styles.departmentCard}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.departmentName}>Packaging</Text>
              <Text style={styles.headText}>Head: Akoto Boakye</Text>
            </View>
            <View style={styles.workerBadge}>
              <Text style={styles.workerText}>9 workers</Text>
            </View>
          </View>
        </View>

        {/* --- CREATE DEPARTMENT BUTTON --- */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>+ Create department</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    backgroundColor: '#1E3A8A', // Dark blue header bar
    paddingTop: 50, // Spaces it below the camera notch
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF', // White text for header
    fontSize: 22,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White screen background
  },
  scrollContent: {
    padding: 20,
  },
  departmentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Soft thin grey border
    borderRadius: 16, // Rounded box corners
    padding: 18,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentName: {
    color: '#1F2937', // Bold dark text
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  headText: {
    color: '#6B7280', // Grey text for head beneath
    fontSize: 14,
  },
  workerBadge: {
    backgroundColor: '#EFF6FF', // Light blue background pill
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  workerText: {
    color: '#1D4ED8', // Blue text for numbers
    fontWeight: '600',
    fontSize: 14,
  },
  createButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1D4ED8', // Blue outline border
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#1D4ED8', // Blue text
    fontSize: 16,
    fontWeight: '600',
  },
});