import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BranchesScreen() {
  return (
    <View style={styles.mainWrapper}>
      {/* --- BLUE HEADER BAR --- */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Branches</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* --- KUMASI HQ CARD --- */}
        <View style={styles.branchCard}>
          <View style={styles.cardRow}>
            <View style={styles.leftContent}>
              <Text style={styles.branchName}>Kumasi HQ</Text>
              <Text style={styles.locationText}>Adum, Kumasi</Text>
              <Text style={styles.statsText}>39 workers - 8 machines</Text>
            </View>
            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>Main</Text>
            </View>
          </View>
        </View>

        {/* --- ACCRA BRANCH CARD --- */}
        <View style={styles.branchCard}>
          <View style={styles.cardRow}>
            <View style={styles.leftContent}>
              <Text style={styles.branchName}>Accra Branch</Text>
              <Text style={styles.locationText}>Tema Industrial{"\n"}Area</Text>
              <Text style={styles.statsText}>21 workers - 5 machines</Text>
            </View>
            <View style={styles.branchBadge}>
              <Text style={styles.branchBadgeText}>Branch</Text>
            </View>
          </View>
        </View>

        {/* --- ADD BRANCH BUTTON --- */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add branch</Text>
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
    paddingTop: 50, 
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF', 
    fontSize: 22,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  scrollContent: {
    padding: 20,
  },
  branchCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', 
    borderRadius: 16, 
    padding: 18,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
  },
  branchName: {
    color: '#1F2937', 
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  locationText: {
    color: '#6B7280', 
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  statsText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '500',
  },
  mainBadge: {
    backgroundColor: '#E6F4EA', // Light green background
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mainBadgeText: {
    color: '#137333', // Dark green text
    fontWeight: 'bold',
    fontSize: 14,
  },
  branchBadge: {
    backgroundColor: '#EFF6FF', // Light blue background
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  branchBadgeText: {
    color: '#1D4ED8', // Blue text
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1D4ED8', 
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#1D4ED8', 
    fontSize: 16,
    fontWeight: '600',
  },
});



