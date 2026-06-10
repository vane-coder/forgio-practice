import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BranchesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Branches</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Kumasi HQ */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.textSection}>
              <Text style={styles.branchName}>Kumasi HQ</Text>
              <Text style={styles.location}>Adum, Kumasi</Text>
              <Text style={styles.details}>
                39 workers - 8 machines
              </Text>
            </View>

            <View style={styles.mainBadge}>
              <Text style={styles.mainBadgeText}>Main</Text>
            </View>
          </View>
        </View>

        {/* Accra Branch */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.textSection}>
              <Text style={styles.branchName}>Accra Branch</Text>
              <Text style={styles.location}>Tema Industrial Area</Text>
              <Text style={styles.details}>
                21 workers - 5 machines
              </Text>
            </View>

            <View style={styles.branchBadge}>
              <Text style={styles.branchBadgeText}>Branch</Text>
            </View>
          </View>
        </View>

        {/* Add Branch Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>
            + Add branch
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BranchesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    backgroundColor: '#0E1733',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 24,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EAF0',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  textSection: {
    flex: 1,
  },

  branchName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  location: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },

  details: {
    fontSize: 16,
    color: '#374151',
  },

  mainBadge: {
    backgroundColor: '#E7F7EA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },

  mainBadgeText: {
    color: '#2E9E44',
    fontWeight: '700',
    fontSize: 14,
  },

  branchBadge: {
    backgroundColor: '#E8F2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },

  branchBadgeText: {
    color: '#4A8CFF',
    fontWeight: '700',
    fontSize: 14,
  },

  addButton: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#4A8CFF',
    borderRadius: 16,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  addButtonText: {
    color: '#4A8CFF',
    fontSize: 18,
    fontWeight: '600',
  },
});