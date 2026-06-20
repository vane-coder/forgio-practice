import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const recordsData = [
  { id: '1', title: 'Cotton shirt', date: '28 Apr - Morning shift', units: '120 units', status: 'Submitted' },
  { id: '2', title: 'Cotton shirt', date: '27 Apr - Morning shift', units: '98 units', status: 'Submitted' },
  { id: '3', title: 'Cotton shirt', date: '26 Apr - Morning shift', units: '134 units', status: 'Submitted' },
];

export default function MyRecordsScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.recordItem}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.units}>{item.units}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>My records</Text>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList 
          data={recordsData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  blueHeader: { 
    backgroundColor: '#0548ac', 
    paddingTop: 80, 
    paddingBottom: 30, 
    paddingHorizontal: 20 
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  listContainer: { flex: 1, padding: 20 },
  recordItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  units: { fontSize: 16, fontWeight: 'bold', color: '#002D72' },
  statusBadge: { backgroundColor: '#e0f2f1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusText: { fontSize: 11, color: '#00796b', fontWeight: '500' }
});

