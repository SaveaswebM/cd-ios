import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const CustomLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default CustomLoadingScreen;
