import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";

import * as Linking from "expo-linking";
import MyTable from "../components/Table";
import CustomDropdown from "../components/Dropdown";
import Header from "../components/Header";
import MakeTeamModal from "../components/MakeTeamModal";
import PeriodDropdown from "../components/PeriodDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LinkInput from "../components/LinkInput";
import Refresh from "../components/Refresh";
// import CustomLoadingScreen from "../components/CustomLoadingScreen";

const Index = ({ navigation }) => {
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [activities, setActivities] = useState([]);
  const [companyName, setCompanyName] = useState([]);
  const [isMakeTeamModalVisible, setIsMakeTeamModalVisible] = useState(false);
  const [isPeriodDropdownVisible, setIsPeriodDropdownVisible] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [buttonLayout, setButtonLayout] = useState({ width: 0, y: 0 });
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  const buttonRef = useRef(null);
  // const options2 = [
  //   { label: "Audit / Tax (Monthly)", value: "Audit / Tax (Monthly)" },
  //   { label: "Audit / Tax (Quarterly)", value: "Audit / Tax (Quarterly)" },
  //   { label: "Audit / Tax (Yearly)", value: "Audit / Tax (Yearly)" },
  //   { label: "GST", value: "GST" },
  //   { label: "CS", value: "CS" },
  //   { label: "HR", value: "HR" },
  //   { label: "Other", value: "Other" },
  // ];

  // useEffect(() => {
  //   const loadCompanyNames = async () => {
  //     try {
  //       if (companyName) {
  //         const storedCompanyNames = await AsyncStorage.getItem("companyNames");
  //         setCompanyName(JSON.parse(storedCompanyNames));
  //       }
  //     } catch (error) {
  //       console.error("Failed to load company names:", error);
  //     }
  //   };
  //   loadCompanyNames();
  // }, []);
  useEffect(() => {
    const getEmployeeStatus = async () => {
      const getstatus = await AsyncStorage.getItem("isEmployeeTrue");
      if (getstatus === "yes") {
        setIsEmployee(true);

        const getcompanyname = await AsyncStorage.getItem("link-company");
        const company2 = JSON.parse(getcompanyname);
        setCompanyName(company2);
        const getactivities = await AsyncStorage.getItem("link-activities");
        const acti = JSON.parse(getactivities);
        setActivities(acti);
      }
    };
    getEmployeeStatus();
  }, []);
  useEffect(() => {
    const loadCompanyNames = async () => {
      try {
        if (!isEmployee) {
          const storedCompanyNames = await AsyncStorage.getItem("companyNames");

          setCompanyName(JSON.parse(storedCompanyNames) || []);
        } else {
          const linkCompanyNames = await AsyncStorage.getItem("link-company");
          const linkCompany = JSON.parse(linkCompanyNames);

          setCompanyName(linkCompany);
        }
      } catch (error) {
        console.error("Failed to load company names:", error);
      }
    };
    loadCompanyNames();
  }, []);
  useEffect(() => {
    const fetchAndStoreActivities = async () => {
      try {
        const previoustoredActivities = await AsyncStorage.getItem(
          "activities"
        );
        if (previoustoredActivities) {
          setActivities(JSON.parse(previoustoredActivities));
        }

        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/activity"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const apiActivities = data.map((activity) => ({
          label: activity.name,
          value: activity.name,
          type: activity.type,
        }));

        // Get stored activities from AsyncStorage
        const storedActivities = await AsyncStorage.getItem("activities");
        const parsedStoredActivities = JSON.parse(storedActivities) || [];

        // Create a set of stored activity names for quick lookup
        const storedActivityNames = new Set(
          parsedStoredActivities.map((act) => act.label)
        );

        // Filter out the activities that are already stored
        const newActivities = apiActivities.filter(
          (activity) => !storedActivityNames.has(activity.label)
        );

        // If there are new activities, update AsyncStorage

        if (newActivities.length > 0 && !isEmployee) {
          const updatedActivities = [
            ...parsedStoredActivities,
            ...newActivities,
          ];
          await AsyncStorage.setItem(
            "activities",
            JSON.stringify(updatedActivities)
          );
          setActivities(updatedActivities);
        } else {
          setActivities(parsedStoredActivities);
          console.log(parsedStoredActivities);
        }
      } catch (error) {
        console.error("Failed to fetch or store activities:", error);
        Alert.alert(
          "Error",
          "Failed to load activities. Please try again later."
        );
      }
    };
    const fetchAndStorLinkeActivities = async () => {
      const linkActivites = await AsyncStorage.getItem("link-activites");

      setActivities(JSON.parse(linkActivites));
    };

    if (!isEmployee) {
      fetchAndStoreActivities();
    } else {
      fetchAndStorLinkeActivities();
    }
  }, []);

  // const uniqueLink = `${baseUrl}?id=${uniqueId}`;
  // Handle deep linking
  useEffect(() => {
    const handleDeepLink = async () => {
      const { queryParams } = Linking.parse(Linking.getInitialURL());
      if (queryParams) {
        const { companyName, activityName } = queryParams;
        setSelectedCompanyName(companyName || null);
        setSelectedActivityName(activityName || null);
      }
    };
    handleDeepLink();
  }, []);
  const handleAddCompany = async (newCompanyName) => {
    try {
      const isDuplicate = companyName.some((company) => {
        return company.value.toLowerCase() === newCompanyName.toLowerCase();
      });
      if (isDuplicate) {
        // await AsyncStorage.clear();
        setErrorMessage(
          "The company name already exists. Please enter a different name."
        );
      } else {
        setErrorMessage("");

        const newCompany = { label: newCompanyName, value: newCompanyName };
        const updatedCompanyName = [...companyName, newCompany];
        setCompanyName(updatedCompanyName);
        await AsyncStorage.setItem(
          "companyNames",
          JSON.stringify(updatedCompanyName)
        );
        setShowAddCompanyModal(false);
        Alert.alert("Success", "Company name added successfully!");
      }
    } catch (error) {
      console.error("Failed to save company name:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header navigation={navigation} isEmployee={isEmployee} />
      <ScrollView style={styles.scrollview}>
        <View style={styles.container}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <CustomDropdown
                options={companyName}
                userName={userName}
                setUserName={setUserName}
                onSelect={(option) => setSelectedCompanyName(option.value)}
                isCompanyDropdown={true}
                onAddCompany={handleAddCompany}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                showAddCompanyModal={showAddCompanyModal}
                setShowAddCompanyModal={setShowAddCompanyModal}
                isEmployee={isEmployee}
                placeholder={
                  selectedCompanyName
                    ? `${selectedCompanyName}`
                    : "Company Name"
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomDropdown
                isActivityDropdown={true}
                activities={activities}
                setActivities={setActivities}
                options={activities}
                userName={userName}
                setUserName={setUserName}
                isEmployee={isEmployee}
                showAddActivityModal={showAddActivityModal}
                setShowAddActivityModal={setShowAddActivityModal}
                onSelect={(option) => {
                  setSelectedActivityName(option.value),
                    setSelectedActivityType(option.type);
                }}
                placeholder={
                  selectedActivityName
                    ? ` ${selectedActivityName}`
                    : "Select Activity"
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isEmployee && { backgroundColor: "#d3d3d3" }, // Change button color when disabled
                ]}
                onPress={() => setIsMakeTeamModalVisible(true)}
                disabled={isEmployee}
              >
                <Text style={styles.buttonText}>Make A Team</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.buttonContainer}
              onLayout={(event) => {
                const { width, y } = event.nativeEvent.layout;
                setButtonLayout({ width, y });
              }}
            >
              <TouchableOpacity
                ref={buttonRef}
                style={[
                  styles.dropdownButton,
                  selectedActivityType === "admin" && {
                    backgroundColor: "#d3d3d3",
                  }, // Change button color when disabled
                ]}
                onPress={() => {
                  if (selectedActivityType !== "admin") {
                    setIsPeriodDropdownVisible(true);
                  }
                }}
                disabled={selectedActivityType === "admin"}
              >
                <Text style={styles.buttonText}>
                  {selectedActivityType === "Monthly"
                    ? `${
                        selectedMonth ? selectedMonth + " " : ""
                      }${selectedYear}`
                    : selectedYear
                    ? selectedYear
                    : "Period  "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* {<Refresh />} */}
        </View>
        {
          <MyTable
            companyName={selectedCompanyName}
            selectedActivityType={selectedActivityType}
            selectedActivity={selectedActivityName}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            tableData={tableData} // Pass filtered data as props
            setTableData={setTableData}
            name={userName}
            isEmployee={isEmployee}
            // loading={loading}
          />
        }

        <View>
          <LinkInput
            isEmployee={isEmployee}
            setIsEmployee={setIsEmployee}
            setCompanyName={setCompanyName}
            setActivities={setActivities}
          />
        </View>
      </ScrollView>
      <MakeTeamModal
        visible={isMakeTeamModalVisible}
        onClose={() => setIsMakeTeamModalVisible(false)}
        companyNameOptions={companyName}
        groupOptions={activities}
        years={years}
      />
      <PeriodDropdown
        visible={isPeriodDropdownVisible}
        setIsVisible={setIsPeriodDropdownVisible}
        onClose={() => setIsPeriodDropdownVisible(false)}
        selectedActivityType={selectedActivityType}
        years={years}
        setYears={setYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        buttonWidth={buttonLayout.width}
        buttonY={buttonLayout.y}
        buttonRef={buttonRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dropdownButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#008DD2",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 10,
    color: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 2,
  },
});

export default Index;
