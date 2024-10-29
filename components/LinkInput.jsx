import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64";

const LinkInput = ({
  isEmployee,
  setIsEmployee,
  setActivities,
  setCompanyName,
  setUserName,
  companyName,
}) => {
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
      await AsyncStorage.setItem("isEmployeeTrue", "yes");
      const name = base64.decode(queryParams.get("name"));
      // const company = base64.decode(queryParams.get("company"));
      // const activities = base64
      //   .decode(queryParams.get("activities"))
      //   .split(","); // Split activities back into an array
      const id = queryParams.get("link"); // This is a unique ID, not encoded
      setIsEmployee(true);

      // Store the decoded data in state
      // setFetchedData({ name, company, activities, id });

      // const newCompany = {
      //   label: company,
      //   value: company,
      // };

      // const updatedCompanyName = [newCompany];
      // const activ = JSON.parse(activities);
      // setCompanyName(updatedCompanyName);
      // setActivities(JSON.parse(activities));
      setUserName(name);
      await getAccessData(id, name);
      await AsyncStorage.setItem("employeeLink", id);
      await AsyncStorage.setItem("userName", name);
      // await AsyncStorage.setItem(
      //   "link-company",
      //   JSON.stringify(updatedCompanyName)
      // );
      // await AsyncStorage.setItem("link-activities", JSON.stringify(activ));
      const response = await fetch(
        `https://cd-backend-1.onrender.com/api/link-data?link=${id}`
      );
      const result = await response.json();

      if (result) {
        const linkData = result.data;
        for (const key in linkData) {
          if (linkData.hasOwnProperty(key)) {
            const value = JSON.stringify(linkData[key]);

            await AsyncStorage.setItem(key, value);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching parameters:", error);
      Alert.alert("Error", "Failed to fetch link parameters.");
    }
  };

  const getAccessData = async (id, name) => {
    try {
      console.log("calleeed");
      const response = await fetch(
        `https://cd-backend-1.onrender.com/api/link-data/access-list?link=${id}&employeeName=${name}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Access data received:", data);
        const companies = data.companies;

        if (companies) {
          // Loop over the companies object and log or process the companies and activities

          const companyList = Object.keys(companies).map((company) => ({
            label: company,
            value: company,
          }));
          setCompanyName(companyList);
          await AsyncStorage.setItem(
            "link-company",
            JSON.stringify(companyList)
          );

          const structuredCompanies = [];

          Object.keys(companies).forEach((companyName) => {
            const activities = companies[companyName];

            // Push an object where the key is the company name and the value is the activities
            structuredCompanies.push({ [companyName]: activities });
          });

          // console.log("Structured Companies: ", structuredCompanies);

          await AsyncStorage.setItem(
            "link-activities",
            JSON.stringify(structuredCompanies)
          );
        }
      }
    } catch (error) {}
  };

  // Handle apply action
  const handleApply = async () => {
    if (link.trim()) {
      try {
        setAppliedLink(link);

        await AsyncStorage.clear();
        await AsyncStorage.setItem("isEmployeeTrue", "yes");
        // Alert.alert("Success", "AsyncStorage has been cleared!");

        fetchLinkParameters(link);
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
        // Alert.alert("Error", "Failed to clear AsyncStorage.");
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

      {/* {appliedLink ? (
        <View style={styles.linkDisplayContainer}>
          <Text style={styles.appliedLinkLabel}>Applied Link:</Text>
          <Text style={styles.appliedLink}>{appliedLink}</Text>
        </View>
      ) : null} */}
    </View>
  );
};

export default LinkInput;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkDisplayContainer: {
    marginTop: 20,
  },
  appliedLinkLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  appliedLink: {
    fontSize: 16,
    color: "#333",
  },
  fetchedDataContainer: {
    marginTop: 20,
  },
  fetchedDataLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
