import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import UUID from "react-native-uuid";
import CustomDropdown from "./Dropdown";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64";

const MakeTeamModal = ({
  visible,
  setVisible,

  onClose,
  companyNameOptions,
  groupOptions,
  years,
  selectedCompanyName,
  selectedActivityName,
  selectedActivityType,
}) => {
  const [personName, setPersonName] = useState("");
  // const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Fetch data from API

    const fetchApiData = async () => {
      try {
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/data"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to load data. Please try again later.");
      }
    };

    fetchApiData();
  }, []);
  //  fetch all employee list for dropdown\

  useEffect(() => {
    const fetchApiData = async () => {
      const id = await AsyncStorage.getItem("links");
      if (id) {
        const fetchlist = await fetch(
          `https://cd-backend-1.onrender.com/api/link-data/full-employee-list?link=${id}`
        );
        if (fetchlist) {
          const dataa = await fetchlist.json();
          console.log("dataa", dataa);
          const members = dataa.employeeNames.map((name) => ({
            label: name, // The display label
            value: name, // The value that will be used internally
          }));

          setMembers(members);
        }
      }
    };
    fetchApiData();
  }, []);
  const getFromattedApiData = async (
    selectedActivityType,
    selectedActivity,
    selectedYear,
    selectedMonth
  ) => {
    let activityData = [];

    if (selectedActivityType === "Monthly") {
      activityData =
        fetchedData.Monthly?.[selectedActivity]?.[selectedYear]?.[
        selectedMonth
        ] || [];
    } else if (selectedActivityType === "Quarterly") {
      activityData =
        fetchedData.Quarterly?.[selectedActivity]?.[selectedYear] || [];
    } else if (selectedActivityType === "Yearly") {
      activityData =
        fetchedData.Yearly?.[selectedActivity]?.[selectedYear] || [];
    }
    // console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",activityData);

    const formattedTableData = activityData.map((entry) => [
      entry.name,
      entry.dueDate,
      "",
      "",
    ]);

    return formattedTableData;
  };

  const getUniqueId = async () => {
    try {
      const getStoredUniqueId = await AsyncStorage.getItem("uniqueId");
      if (getStoredUniqueId) {
        return getStoredUniqueId;
      } else {
        const uniqueId = UUID.v4();
        await AsyncStorage.setItem("uniqueId", uniqueId);
        return uniqueId;
      }
    } catch (error) {
      console.error("Error getting or setting unique ID:", error);
      return null; // Or handle the error as needed
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // const fetchlist = await fetch(
    //   `https://cd-backend-1.onrender.com/api/link-data/full-employee-list?link=${id}`
    // );
    // if (fetchlist) {
    //   const dataa = fetchlist.json();
    //   setMembers(dataa);
    // }
    if (selectedActivityName && selectedActivityType) {
      setSelectedGroups([
        {
          label: `${selectedActivityName}`,
          type: `${selectedActivityType}`,
          value: `${selectedActivityName}`,
        },
      ]);
      // console.log(selectedGroups);
    }
    if (!personName || !selectedCompanyName || selectedGroups.length === 0) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      // Generate the unique link
      const uId = await getUniqueId();

      const encodedPersonName = base64.encode(personName);
      const encodedCompanyName = base64.encode(selectedCompanyName);
      const encodedGroups = base64.encode(JSON.stringify(selectedGroups));
      const baseUrl = "https://compliancediary.in/";
      const queryParameters = `?name=${encodedPersonName}&link=${uId}`;
      const link = `${baseUrl}${queryParameters}`;

      const result = await Share.share({
        message: ` Here's the link: ${link}`,
      });
      console.log(selectedGroups);
      if (result.action === Share.sharedAction) {
        const owner = await AsyncStorage.getItem("userName");
        const employeeName = personName;

        let data = {};

        for (const group of selectedGroups) {
          for (const year of years) {
            if (group.type === "Monthly") {
              for (const month of months) {
                const monthlyDataKey = `${selectedCompanyName}_${group.value}_${year}_${month}`;
                let monthlyData = await AsyncStorage.getItem(monthlyDataKey);

                if (monthlyData) {
                  try {
                    // Parse stringified JSON from AsyncStorage if necessary
                    data[monthlyDataKey] = JSON.parse(monthlyData);
                  } catch (error) {
                    console.error(
                      `Failed to parse monthly data for ${monthlyDataKey}:`,
                      error
                    );
                    data[monthlyDataKey] = monthlyData; // Fallback to raw string data if parsing fails
                  }
                } else {
                  // Fetch data from API if not in AsyncStorage
                  const apiMonthlyData = await getFromattedApiData(
                    "Monthly",
                    group.value,
                    year,
                    month
                  );
                  if (apiMonthlyData.length > 0) {
                    data[monthlyDataKey] = apiMonthlyData;
                  }
                }
              }
            } else if (group.type === "Quarterly") {
              const quarterlyDataKey = `${selectedCompanyName}_${group.value}_${year}`;
              let quarterlyData = await AsyncStorage.getItem(quarterlyDataKey);

              if (quarterlyData) {
                try {
                  data[quarterlyDataKey] = JSON.parse(quarterlyData);
                } catch (error) {
                  console.error(
                    `Failed to parse quarterly data for ${quarterlyDataKey}:`,
                    error
                  );
                  data[quarterlyDataKey] = quarterlyData;
                }
              } else {
                const apiQuarterlyData = await getFromattedApiData(
                  "Quarterly",
                  group.value,
                  year
                );
                if (apiQuarterlyData.length > 0) {
                  data[quarterlyDataKey] = apiQuarterlyData;
                }
              }
            } else if (group.type === "Yearly") {
              const yearlyDataKey = `${selectedCompanyName}_${group.value}_${year}`;
              let yearlyData = await AsyncStorage.getItem(yearlyDataKey);

              if (yearlyData) {
                try {
                  data[yearlyDataKey] = JSON.parse(yearlyData);
                } catch (error) {
                  console.error(
                    `Failed to parse yearly data for ${yearlyDataKey}:`,
                    error
                  );
                  data[yearlyDataKey] = yearlyData;
                }
              } else {
                const apiYearlyData = await getFromattedApiData(
                  "Yearly",
                  group.value,
                  year
                );
                if (apiYearlyData.length > 0) {
                  data[yearlyDataKey] = apiYearlyData;
                }
              }
            } else if (group.type === "Admin") {
              const adminDataKey = `${selectedCompanyName}_${group.value}`;
              let adminData = await AsyncStorage.getItem(adminDataKey);

              if (adminData) {
                try {
                  data[adminDataKey] = JSON.parse(adminData);
                } catch (error) {
                  console.error(
                    `Failed to parse admin data for ${adminDataKey}:`,
                    error
                  );
                  data[adminDataKey] = adminData;
                }
              }
            }
          }
        }

        const payload = {
          link: uId,
          owner,
          employeeName,
          companyName: selectedCompanyName,
          // activities: {},
          activityName: selectedGroups,
          data,
        };
        //  console.log("payload data", payload);
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/link-data",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setLoading(false);
          Alert.alert("Share Data Sent Successfully");
          // console.log("Success", "Link shared and saved successfully.");

          // Save the link to AsyncStorage
          // const storedLinks = await AsyncStorage.getItem('links');
          // let linksArray = [];

          // if (storedLinks) {
          //   linksArray = JSON.parse(storedLinks);
          // }

          // linksArray.push(uId);  // Add the new link to the array

          await AsyncStorage.setItem("links", uId);
        } else {
          setLoading(false);
          console.error(result);
          Alert.alert("Error", result.error || "Failed to share the link.");
        }
      }
    } catch (error) {
      console.error("Error sharing link:", error);
      Alert.alert("Sharing Error", "An error occurred while trying to share the link.");
    }

    onClose();
  };
  const giveAccess = async () => {
    setLoading(true);
    try {
      if (selectedActivityName && selectedCompanyName) {
        setSelectedGroups([
          {
            label: `${selectedActivityName}`,
            type: `${selectedActivityType}`,
            value: `${selectedActivityName}`,
          },
        ]);
        const id = await AsyncStorage.getItem("links");
        if (id) {
          const payload = {
            link: id,
            employeeName: selectedEmployee.label,
            companyName: selectedCompanyName,
            activityName: selectedGroups,
          };
          console.log("payload data", payload);
          const response = await fetch(
            "http://cd-backend-1.onrender.com/api/link-data/modify-access",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const res = await response.json();
          console.log(res);
          if (response.ok) {
            setLoading(false);
            console.log("access been given");
            setVisible(false);
            Alert.alert("Access has been given");
          }
          else {
            setLoading(false);
            setVisible(false);
            Alert.alert("All provided activities already exist for company Saveasweb")
          }
        } else {
          setLoading(false);
          Alert.alert("Link not found");
          console.log("access not given");
        }
      }
    } catch (error) {
      // Alert.alert(error);
    }
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SingleSelect
              options={members} // Now 'members' is an array of objects with 'label' and 'value'
              onSelect={setSelectedEmployee}
              selectedItem={selectedEmployee}
              placeholder="Select Existing Member"
              style={styles.fullWidthDropdown}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Person Name"
              placeholderTextColor="#000"
              value={personName}
              onChangeText={setPersonName}
            />

            {/* <MultiSelect
              options={members}
              onSelect={setSelectedGroups}
              selectedItems={selectedGroups}
              placeholder="Select Activities"
              style={styles.fullWidthDropdown}
            /> */}
            {/* {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )} */}
            {selectedEmployee && (
              <TouchableOpacity style={styles.saveButton} onPress={giveAccess} disabled={loading}>
                {
                  loading ? (
                    <ActivityIndicator size={"small"} color={"#ffffff"} />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      Add Access
                    </Text>
                  )
                }
              </TouchableOpacity>
            )}
            {!selectedEmployee && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                {
                  loading ? (
                    <ActivityIndicator size={"small"} color={"#ffffff"} />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      Share
                    </Text>
                  )
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#5290D7",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#003067",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "black",
    backgroundColor: "#FFFFFF",
  },
  fullWidthDropdown: {
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#00397A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default MakeTeamModal;
