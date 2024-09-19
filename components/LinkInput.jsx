import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64"; // For decoding base64 values

const LinkInput = (isEmployee, setIsEmployee, setActivites, setCompanyName) => {
  const [link, setLink] = useState(""); // State to hold the entered link
  const [appliedLink, setAppliedLink] = useState(""); // State to hold the applied link
  const [fetchedData, setFetchedData] = useState(null);

  // Function to fetch and decode parameters from the link
  const fetchLinkParameters = async (url) => {
    try {
      // Parse the URL and query parameters
      const parsedUrl = new URL(url);
      const queryParams = new URLSearchParams(parsedUrl.search);

      // Fetch each parameter and decode the base64-encoded values
      const name = base64.decode(queryParams.get("name"));
      const company = base64.decode(queryParams.get("company"));
      const activities = base64
        .decode(queryParams.get("activities"))
        .split(","); // Split activities back into an array
      const id = queryParams.get("id"); // This is a unique ID, not encoded

      // Store the decoded data in state
      setFetchedData({ name, company, activities, id });
      const newCompany = {
        label: company,
        value: company
      };
      const updatedCompanyName = [newCompany];
      setCompanyName(updatedCompanyName);
      setActivites(activities);
      const response = await fetch(
        `http://localhost:3000/api/link-data?link=${id}`
      );
      const result = response.json();
      if (result.ok) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem("isEmployeeTrue", "yes");
        await AsyncStorage.setItem("link-company", company);
        await AsyncStorage.setItem("link-activities", activities);
        await AsyncStorage.setItem("userName", name);

        const linkData = result.data;
        for (const key in linkData) {
          if (linkData.hasOwnProperty(key)) {
            const value = JSON.stringify(linkData[key]); // Convert value to a string
            await AsyncStorage.setItem(key, value); // Store key-value pair in AsyncStorage
          }
        }

        setIsEmployee(true);
      } else {
        console.error("Error fetching link data:", error);
      }
    } catch (error) {
      console.error("Error fetching parameters:", error);
      Alert.alert("Error", "Failed to fetch link parameters.");
    }
  };

  // Handle apply action
  const handleApply = async () => {
    if (link.trim()) {
      try {
        setAppliedLink(link);

        await AsyncStorage.clear();
        Alert.alert("Success", "AsyncStorage has been cleared!");

        fetchLinkParameters(link);
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
        Alert.alert("Error", "Failed to clear AsyncStorage.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid link.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Link:</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste or type your link here"
        value={link}
        onChangeText={setLink} // Update the state when text is entered
        keyboardType="url" // Optional: Set keyboard type to URL for convenience
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>

      {appliedLink ? (
        <View style={styles.linkDisplayContainer}>
          <Text style={styles.appliedLinkLabel}>Applied Link:</Text>
          <Text style={styles.appliedLink}>{appliedLink}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default LinkInput;

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 20
  },
  applyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center"
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  linkDisplayContainer: {
    marginTop: 20
  },
  appliedLinkLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  appliedLink: {
    fontSize: 16,
    color: "#333"
  },
  fetchedDataContainer: {
    marginTop: 20
  },
  fetchedDataLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  }
});
