import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Dummy data — replace with real API call from permissions.service.ts later
const workers = [
  {
    id: 1,
    name: "Attuah Jessica",
    initials: "AJ",
    department: "Cutting dept",
    role: "DEPT_HEAD",
    permissions: {
      viewReports: true,
      enterData: true,
      admin: false,
    },
  },
  {
    id: 2,
    name: "Apoasan Akologo",
    initials: "AA",
    department: "Assembly dept",
    role: "DEPT_HEAD",
    permissions: {
      viewReports: true,
      enterData: true,
      admin: false,
    },
  },
  {
    id: 3,
    name: "Vanessa Oware",
    initials: "VO",
    department: "Cutting dept",
    role: "WORKER",
    permissions: {
      viewReports: false,
      enterData: true,
      admin: false,
    },
  },
  {
    id: 4,
    name: "Akoto Boakye",
    initials: "AB",
    department: "Packaging dept",
    role: "DEPT_HEAD",
    permissions: {
      viewReports: true,
      enterData: true,
      admin: false,
    },
  },
  {
    id: 5,
    name: "Raina Pryce",
    initials: "RP",
    department: "Assembly dept",
    role: "WORKER",
    permissions: {
      viewReports: false,
      enterData: true,
      admin: false,
    },
  },
];

const getRoleBadge = (role: string) => {
  if (role === "DEPT_HEAD") return { bg: "#E3F2FD", color: "#0C447C", label: "Dept Head" };
  if (role === "MANAGER") return { bg: "#E8F5E9", color: "#1B5E20", label: "Manager" };
  return { bg: "#F3E5F5", color: "#4A148C", label: "Worker" };
};

export default function PermissionsScreen() {
  const [search, setSearch] = useState("");

  const filtered = workers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Permissions</Text>
              <Text style={styles.headerSub}>Manage worker access levels</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{workers.length} workers</Text>
            </View>
          </View>

          <View style={styles.body}>

            {/* Search */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search workers..."
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Worker list */}
            <View style={styles.list}>
              {filtered.map((worker, index) => {
                const badge = getRoleBadge(worker.role);
                return (
                  <View
                    key={worker.id}
                    style={[
                      styles.workerItem,
                      index === filtered.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    {/* Worker info row */}
                    <View style={styles.workerRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{worker.initials}</Text>
                      </View>
                      <View style={styles.workerInfo}>
                        <Text style={styles.workerName}>{worker.name}</Text>
                        <Text style={styles.workerDept}>{worker.department}</Text>
                      </View>
                      <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.roleBadgeText, { color: badge.color }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Permission tags */}
                    <View style={styles.permissionRow}>
                      <View style={[
                        styles.permTag,
                        { backgroundColor: worker.permissions.viewReports ? "#E8F5E9" : "#FFEBEE" }
                      ]}>
                        <Text style={[
                          styles.permTagText,
                          { color: worker.permissions.viewReports ? "#1B5E20" : "#B71C1C" }
                        ]}>
                          {worker.permissions.viewReports ? "View reports" : "No reports"}
                        </Text>
                      </View>

                      <View style={[
                        styles.permTag,
                        { backgroundColor: worker.permissions.enterData ? "#E8F5E9" : "#FFEBEE" }
                      ]}>
                        <Text style={[
                          styles.permTagText,
                          { color: worker.permissions.enterData ? "#1B5E20" : "#B71C1C" }
                        ]}>
                          {worker.permissions.enterData ? "Enter data" : "No data entry"}
                        </Text>
                      </View>

                      <View style={[
                        styles.permTag,
                        { backgroundColor: worker.permissions.admin ? "#E8F5E9" : "#FFEBEE" }
                      ]}>
                        <Text style={[
                          styles.permTagText,
                          { color: worker.permissions.admin ? "#1B5E20" : "#B71C1C" }
                        ]}>
                          {worker.permissions.admin ? "Admin" : "No admin"}
                        </Text>
                      </View>

                      {/* Edit button */}
                      <TouchableOpacity style={styles.editBtn}>
                        <Ionicons name="pencil-outline" size={13} color="#1565C0" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Assign button */}
            <TouchableOpacity style={styles.assignBtn}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
              <Text style={styles.assignBtnText}>Assign permissions</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // Header
  header: {
    backgroundColor: "#1565C0",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  headerSub: {
    fontSize: 11,
    color: "#90CAF9",
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 11,
    color: "#fff",
  },

  // Body
  body: {
    padding: 16,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },

  // List
  list: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    marginBottom: 14,
  },
  workerItem: {
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0C447C",
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  workerDept: {
    fontSize: 12,
    color: "#888",
    marginTop: 1,
  },
  roleBadge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Permission tags
  permissionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  permTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  permTagText: {
    fontSize: 11,
  },
  editBtn: {
    marginLeft: "auto",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },

  // Assign button
  assignBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1565C0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
  },
  assignBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});