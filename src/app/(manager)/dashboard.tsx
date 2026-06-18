import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const username = "Vanessa Oware";
const day = "Good morning";
export default function DashboardScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1565C0" }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.subheader}>

              <View>
                <Text style={styles.time}>{day} </Text>
                {/* TODO: Build the Dashboard screen */}
                <Text style={styles.title}>{username}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatartext}>VO</Text>
              </View>
            </View>

            <View style={styles.production}>
              <Text style={styles.info}>Today's production </Text>
              <Text>
                <Text style={styles.number}>1240</Text> <Text style={styles.unit}> units</Text>
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.matbox}>
              <Text style={styles.name}>Materials</Text>
              <Text style={styles.amount}>12</Text>
              <Text style={styles.text}>2 low stock</Text>
            </View>

            <View style={styles.matbox}>
              <Text style={styles.name}>Machines</Text>
              <Text style={styles.amount}>8</Text>
              <Text style={styles.redtext}>1 stopped</Text>
            </View>
          </View>

          <View style={styles.AI}>
            <Text style={styles.redtext}>AI Insight</Text>
            <Text style={styles.insight}>Fabric stock will run out in -3 days.
              Consider ordering 200kg this week.
            </Text>
          </View>

          {/* Bottom Nav */}
          <View style={styles.bottomNav}>
            <View style={styles.navItem}>
              <Ionicons name="home" size={22} color="#1565C0" />
              <Text style={styles.navTextActive}>Home</Text>
            </View>
            <View style={styles.navItem}>
              <Ionicons name="bar-chart-outline" size={22} color="#999" />
              <Text style={styles.navText}>Reports</Text>
            </View>
            <View style={styles.navItem}>
              <Ionicons name="business-outline" size={22} color="#999" />
              <Text style={styles.navText}>Factory</Text>
            </View>
            <View style={styles.navItem}>
              <Ionicons name="person-outline" size={22} color="#999" />
              <Text style={styles.navText}>Profile</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#1565C0",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",

  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    paddingBottom: 10

  },
  time: {
    fontSize: 16,
    color: "#B3D4F4",

  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#0C447C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  avatartext: {
    fontSize: 20,
    fontWeight: 500,
    borderRadius: 10,
    color: "#90CAF9",

  },
  production: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: "100%",
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "flex-start"




  },
  info:
  {
    fontSize: 20,
    color: "#B3D4F4",

  },
  number: {
    fontSize: 25,
    fontWeight: "500",
    color: "#fff",

    marginTop: 4,

  },
  unit: {
    fontSize: 15,
    color: "#90CAF9"
  },
  box: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 30,
    width: "100%",
    gap: 20

  },
  matbox: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 10,
    width: "40%",

  },
  name: {
    color: "#1565C0",
    fontWeight: 600
  },
  amount: {
    fontSize: 20,
    fontWeight: 600
  },
  text: {
    color: "#888888",
    fontWeight: 600
  },
  redtext: {
    color: "#C62828",
    fontWeight: 600
  },
  AI: {
    paddingHorizontal: 10,
    width: "80%",
    height: "30%",
    alignItems: "center",
    borderRadius : 10,
    backgroundColor: "#c6622831",
    padding: 20,
    marginTop: 20,
    marginLeft: 30,
    borderWidth: 2,
    borderColor: "#c6622893"
  },
  insight: {
    fontSize: 18
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginTop: 60,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    backgroundColor: "#fff",

  },
  navItem: {
      alignItems  :"center"
  },
  navTextActive: {
    fontSize : 10,
      color: "#1565C0",

  },
  navText: {
    fontSize : 10,
      color: "#999",

  }


}); 