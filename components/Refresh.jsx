import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const Refresh = () => {
  const handlePress = () => {
    // Future function to call an API to refresh data
    console.log("Refresh clicked");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Refresh;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "flex-end", // Aligns items (Text) to the right
    paddingHorizontal: 20, // Adds padding to the sides
  },
  refreshButton: {
    padding: 4,
    // backgroundColor: "#f0f0f0", // Optional: background color
    borderRadius: 5, // Optional: rounded corners
  },
  refreshText: {
    fontSize: 14,
    color: "#000",
  },
});
