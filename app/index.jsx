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
import base64 from "react-native-base64";
import LinkInput from "../components/LinkInput";
import Refresh from "../components/Refresh";
import DropdownTest from "../components/DropdownTest"
// import CustomLoadingScreen from "../components/CustomLoadingScreen";

const Index = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
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
  const [employees, setEmployees] = useState([]);

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

  // useEffect(() => {
  //   const handleDeepLink = async (event) => {
  //     try {
  //       const url = event?.url || (await Linking.getInitialURL());
  //       if (url) {
  //         const { queryParams } = Linking.parse(url);

  //         if (queryParams) {
  //           try {
  //             console.log("............deep linking is working ...........................");

  //             // Access queryParams directly as an object
  //             const name = base64.decode(queryParams.name);
  //             const company = base64.decode(queryParams.company);
  //             const activities = base64.decode(queryParams.activities).split(",");

  //             const id = queryParams.id;
  //             await AsyncStorage.setItem("isEmployeeTrue", "yes");
  //             setIsEmployee(true);

  //             const newCompany = { label: company, value: company };
  //             setCompanyName([newCompany]);
  //             setActivities(activities);
  //             setUserName(name);

  //             await AsyncStorage.setItem("employeeLink", id);
  //             await AsyncStorage.setItem("userName", name);
  //             await AsyncStorage.setItem("link-company", JSON.stringify([newCompany]));
  //             await AsyncStorage.setItem("link-activities", JSON.stringify(activities));

  //             // Fetch additional data based on the link ID
  //             const response = await fetch(`https://cd-backend-1.onrender.com/api/link-data?link=${id}`);
  //             const result = await response.json();

  //             if (result) {
  //               for (const key in result.data) {
  //                 if (result.data.hasOwnProperty(key)) {
  //                   await AsyncStorage.setItem(key, JSON.stringify(result.data[key]));
  //                 }
  //               }
  //             }
  //           } catch (error) {
  //             console.error("Error decoding parameters:", error);
  //             Alert.alert("Error", "Failed to decode link parameters.");
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching initial URL:", error);
  //       Alert.alert("Error", "Failed to fetch initial URL.");
  //     }
  //   };

  //   // Add listener for URL events
  //   Linking.addEventListener("url", handleDeepLink);

  //   // Run on component mount to handle initial deep link
  //   handleDeepLink();

  //   return () => {
  //     Linking.removeEventListener("url", handleDeepLink);
  //   };
  // }, []);

  useEffect(() => {
    const getEmployeeStatus = async () => {
      const getstatus = await AsyncStorage.getItem("isEmployeeTrue");

      if (getstatus === "yes") {
        setIsEmployee(true);

        const getcompanyname = await AsyncStorage.getItem("link-company");
        const company2 = JSON.parse(getcompanyname);
        setCompanyName(company2);
        // const getactivities = await AsyncStorage.getItem("link-activities");

        // const acti = JSON.parse(getactivities);
        // setActivities(acti);
      }
    };
    getEmployeeStatus();
  }, []);
  useEffect(() => {
    const getEmployee = async () => {
      setEmployees([]);
      try {
        if (selectedActivityName && selectedCompanyName && !isEmployee) {
          const id = await AsyncStorage.getItem("links"); // Ensure key is correct
          if (id) {
            const response = await fetch(
              `https://cd-backend-1.onrender.com/api/link-data/employee-list?link=${id}&selectedActivityName=${selectedActivityName}&selectedCompanyName=${selectedCompanyName}`
            );
            if (response.ok) {
              const employeees = await response.json();
              const employeeList = employeees.map((employee) => ({
                label: employee,
                value: employee,
              }));
              //  console.log(employeeList);
              setEmployees(employeeList);
            } else {
              console.log("Error fetching employee data:", response.statusText);
            }
          } else {
            console.log("No link ID found in AsyncStorage");
          }
        }
      } catch (error) {
        console.error("Error in getEmployee function:", error);
      }
    };

    getEmployee();
  }, [selectedActivityName, selectedCompanyName]);

  useEffect(() => {
    const getActivities = async () => {
      try {
        if (isEmployee) {
          // Fetch activities from AsyncStorage
          const storedActivities = await AsyncStorage.getItem(
            "link-activities"
          );

          if (storedActivities) {
            const parsedActivities = JSON.parse(storedActivities); // Parse the JSON data

            // Check if the selected company exists in the parsed activities
            const selectedCompanyActivities = parsedActivities.find(
              (company) => company[selectedCompanyName]
            );

            if (selectedCompanyActivities) {
              const activities = selectedCompanyActivities[selectedCompanyName]; // Get activities for that company
              console.log(`Activities for ${selectedCompanyName}:`, activities);
              setActivities(activities);
              // You can now do something with these activities, like updating state
            } else {
              console.log(`No activities found for ${selectedCompanyName}`);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    // Only fetch activities when selectedCompanyName changes
    getActivities();
  }, [selectedCompanyName]);

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
      const getisEmployee = await AsyncStorage.getItem("isEmployeeTrue");
      if (!getisEmployee) {
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
      }
    };
    const fetchAndStorLinkActivities = async () => {
      const linkActivites = await AsyncStorage.getItem("link-activites");

      setActivities(JSON.parse(linkActivites));
    };

    if (!isEmployee) {
      fetchAndStoreActivities();
    } else {
      fetchAndStorLinkActivities();
    }
  }, []);

  // const uniqueLink = `${baseUrl}?id=${uniqueId}`;
  // Handle deep linking

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
      <View style={styles.container}>
          <View style={styles.buttonRow}>
            {/* <View style={styles.buttonContainer}>
                      <DropdownTest        options={companyName}
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
                isVisible={isVisible}
                setIsVisible={setIsVisible}

                placeholder={
                  selectedCompanyName
                    ? `${selectedCompanyName}`
                    : "Company Name"
                }/>
      </View>
      <View style={styles.buttonContainer}> 
      <DropdownTest   isActivityDropdown={true}
                activities={activities}
                setActivities={setActivities}
                options={activities}
                userName={userName}
                setUserName={setUserName}
                isEmployee={isEmployee}
                showAddActivityModal={showAddActivityModal}
                setShowAddActivityModal={setShowAddActivityModal}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                onSelect={(option) => {
                  setSelectedActivityName(option.value),
                    setSelectedActivityType(option.type);
                }}
                placeholder={
                  selectedActivityName
                    ? ` ${selectedActivityName}`
                    : "Select Activity"
                } />
      </View>
      <View style={styles.buttonContainer}>
      <DropdownTest   
          placeholder={"Make A Team"}
                options={employees}
                isTeamDropdown={true}
                isEmployee={isEmployee}
                selectedCompanyName={selectedCompanyName}
                selectedActivityName={selectedActivityName}
                setIsMakeTeamModalVisible={setIsMakeTeamModalVisible}
                disabled={true}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                onSelect={(selectedOption) => {
                  // Handle the selected option here
                  console.log("Selected option:", selectedOption);
                  // Add any logic you want to perform on selection
                }} />
      </View> */}
      {/* <View style={styles.buttonContainer}>
      <DropdownTest />
    </View> */}
    </View>
    </View>
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
                isVisible={isVisible}
                setIsVisible={setIsVisible}
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
                isVisible={isVisible}
                setIsVisible={setIsVisible}
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
              <CustomDropdown
                placeholder={"Make A Team"}
                options={employees}
                isTeamDropdown={true}
                isEmployee={isEmployee}
                selectedCompanyName={selectedCompanyName}
                selectedActivityName={selectedActivityName}
                setIsMakeTeamModalVisible={setIsMakeTeamModalVisible}
                disabled={true}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                onSelect={(selectedOption) => {
                  // Handle the selected option here
                  console.log("Selected option:", selectedOption);
                  // Add any logic you want to perform on selection
                }}
              />
              {/* <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  isEmployee && { backgroundColor: "#d3d3d3" }, // Change button color when disabled
                ]}
                onPress={() => setIsMakeTeamModalVisible(true)}
                disabled={isEmployee}
              >
                <Text style={styles.buttonText}>Make A Team</Text>
              </TouchableOpacity> */}
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
            setUserName={setUserName}
            companyName={companyName}
          />
        </View>
      </ScrollView>



      
      <MakeTeamModal
        visible={isMakeTeamModalVisible}
        onClose={() => setIsMakeTeamModalVisible(false)}
        companyNameOptions={companyName}
        groupOptions={activities}
        years={years}
        selectedCompanyName={selectedCompanyName}
        selectedActivityName={selectedActivityName}
        selectedActivityType={selectedActivityType}
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
    // flex: 1,
    justifyContent: "top",
    alignItems: "center",
    marginTop: 20,
    zIndex:1,
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
