import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";

const Dropdown = ({
  options,
  setCompanyName,
  onSelect,
  placeholder,
  style,
  isCompanyDropdown,
  isActivityDropdown,
  onAddCompany,
  userName,
  setUserName,
  errorMessage,
  setErrorMessage,
  showAddCompanyModal,
  setShowAddCompanyModal,
  showAddActivityModal,
  setShowAddActivityModal,
  activities,
  setActivities,
  isEmployee,
  isTeamDropdown,
  selectedCompanyName,
  selectedActivityName,
  setIsMakeTeamModalVisible,
  disabled,
  setActivityTypeOption,
  setSelectedActivityName,
  setSelectedActivityType,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newActivityName, setNewActivityName] = useState([]);
  const [activityInputs, setActivityInputs] = useState([
    { action: "", dueDate: new Date() },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(null);
  const [enterUserName, setEnterUserName] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [activityOptionsVisible, setActivityOptionsVisible] = useState(false);

  // const [subscriptionType, setSubscriptionType] = useState("Free");
  const buttonRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        } else {
          // console.log("Please enter your name");
        }
      } catch (error) {
        console.error("Failed to load user name from AsyncStorage", error);
      }
    };

    loadUserName();
  }, []);
  useEffect(() => {
    async function aa() {
      const user = await AsyncStorage.getItem("user");
      const parseuser = JSON.parse(user);
      const st = parseuser.subscriptionType;
      setSubscriptionType(st);
    }
    aa();
  }, []);
  const toggleDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({ top: 0 });
      });
    }
    setIsVisible(!isVisible);
  };

  const handleSelect = (option) => {
    if (isActivityDropdown) {
      setIsVisible(false);
      setSelectedActivityName(option.value);
      setActivityOptionsVisible((prev) => !prev);
    } else {
      setSelectedOption(option);
      onSelect(option);
      setIsVisible(false);
      setActivityOptionsVisible(false);
    }
  };
  const selectActivityTypeOption = (activityOption) => {
    setActivityTypeOption(activityOption);
    setSelectedActivityType(activityOption);
    console.log(
      `Selected Activity Option:${newActivityName} ${activityOption}`
    );
    setActivityOptionsVisible(false); // Close the side dropdown
  };
  const handleAddCompany = async () => {
    if (newCompanyName.trim()) {
      const storeduserName = await AsyncStorage.getItem("userName");
      if (!storeduserName) {
        try {
          await AsyncStorage.setItem("userName", enterUserName);
          setUserName(enterUserName);
        } catch (error) {
          console.error("Failed to save user name to AsyncStorage", error);
        }
      }
      onAddCompany(newCompanyName.trim());
      setNewCompanyName("");
      setIsVisible(false);
    }
  };
  const handleDeleteCompany = async (companyValue) => {
    Alert.alert(
      "Delete Company",
      "Are you sure you want to delete this company?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Update the companyName state
            setCompanyName((options) =>
              options.filter((option) => option.value !== companyValue)
            );

            // Get the link from AsyncStorage
            const link = await AsyncStorage.getItem("links");
            if (link) {
              try {
                // Make the API call to delete the company
                const response = await fetch(
                  `https://cd-backend-1.onrender.com/api/link-data/delete-company?link=${link}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json", // Specify content type
                    },
                    body: JSON.stringify({ companyName: companyValue }), // Send companyName in the request body
                  }
                );

                if (!response.ok) {
                  throw new Error("Failed to delete company");
                }

                const data = await response.json(); // Optionally handle the response data
                console.log(data.message); // Log success message or handle accordingly
              } catch (error) {
                console.error("Error deleting company:", error);
                Alert.alert(
                  "Error",
                  "An error occurred while deleting the company."
                );
              }
            } else {
              Alert.alert("Error", "Link is missing. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowAddCompanyModal(false);
    setErrorMessage("");
  };

  const handleAddActivity = () => {
    setActivityInputs([...activityInputs, { action: "", dueDate: new Date() }]);
  };

  const handleActivityChange = (index, field, value) => {
    const newInputs = [...activityInputs];
    if (field === "dueDate") {
      newInputs[index][field] = value;
    } else {
      newInputs[index][field] = value;
    }
    setActivityInputs(newInputs);
  };

  const handleSaveActivities = async () => {
    try {
      const storedActivities = await AsyncStorage.getItem("activities");
      const existingActivities = storedActivities
        ? JSON.parse(storedActivities)
        : [];

      // Check if the new activity already exists
      const activityExists = existingActivities.some(
        (activity) => activity.value === newActivityName.value
      );
      DrawerContentScrollView;
      if (activityExists) {
        alert("Activity already exists");
      } else {
        // Add the new activity to the list
        const newActivities = [...existingActivities, newActivityName];
        await AsyncStorage.setItem("activities", JSON.stringify(newActivities));
        await AsyncStorage.setItem(
          `${newActivityName.label}`,
          JSON.stringify(activityInputs)
        );
        setActivities(newActivities);
        alert("Activity saved successfully");
      }
    } catch (error) {
      console.error("Failed to save activity to AsyncStorage", error);
    }

    setShowAddActivityModal(false);
    setActivityInputs([{ action: "", dueDate: new Date() }]);
  };

  const onDateChange = (event, selectedDate) => {
    const currentIndex = currentDateIndex;
    setShowDatePicker(false);
    if (selectedDate && currentIndex !== null) {
      handleActivityChange(currentIndex, "dueDate", selectedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isTeamDropdown && isEmployee ? (
        <TouchableOpacity
          ref={buttonRef}
          onPress={toggleDropdown}
          style={[
            styles.dropdownButton,
            { backgroundColor: "#d3d3d3" }, // Change button color when disabled
          ]}
          disabled={true}
        >
          {isTeamDropdown ? (
            <Text style={styles.buttonText}>{placeholder}</Text>
          ) : (
            <Text style={styles.buttonText}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          )}
        </TouchableOpacity>
      ) : isTeamDropdown ? (
        <TouchableOpacity
          ref={buttonRef}
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={styles.buttonText}>{placeholder}</Text>
        </TouchableOpacity>
      ) : isActivityDropdown ? (
        <TouchableOpacity
          ref={buttonRef}
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={styles.buttonText}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          ref={buttonRef}
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={styles.buttonText}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </TouchableOpacity>
      )}
      {activityOptionsVisible && isActivityDropdown && (
        <View style={styles.activityDropdown}>
          {["Monthly", "Quarterly", "Yearly"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => selectActivityTypeOption(option)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isVisible && (
        <View
          transparent
          animationType="none"
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          onDismiss={() => console.log("Modal closed")}
          onShow={() => console.log("Modal opened")}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsVisible(false)}
          >
            <View
              style={[
                styles.modalContent,
                styles.dropdown,
                { top: dropdownPosition.top, left: dropdownPosition.left },
              ]}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleSelect(item);
                    }}
                    onLongPress={() => {
                      if (isCompanyDropdown && !isEmployee) {
                        handleDeleteCompany(item.value); // Function to delete the company
                      }
                    }}
                    style={[styles.option]}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
              />
              {isCompanyDropdown && !isEmployee && (
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const storedCompanyNames = await AsyncStorage.getItem(
                        "companyNames"
                      );
                      const companyList = JSON.parse(storedCompanyNames) || [];
                      const token = await AsyncStorage.getItem("token");
                      // if (token) {
                      //   const userData = await AsyncStorage.getItem("user");
                      //   if (userData) {
                      //     const user = JSON.parse(userData);
                      //     const sType = user.subscriptionType;
                      //     setSubscriptionType(sType);
                      //   }
                      // }
                      if (
                        companyList.length >= 3
                        // &&
                        // subscriptionType === "Free"
                      ) {
                        Alert.alert(
                          "Limit Reached",
                          "On free account, you can add up to 3 companies only.",
                          [
                            {
                              text: "Get Premium",
                              onPress: () => router.push("/Subscription"), // Replace with your subscription page navigation
                            },
                            { text: "OK" },
                          ]
                        );
                      } else if (
                        (subscriptionType === "Professional_monthly" ||
                          subscriptionType === "Professional_yearly") &&
                        companyList.length >= 10
                      ) {
                        Alert.alert(
                          "Limit Reached",
                          "On standard account, you can add up to 10 companies only.",
                          [
                            {
                              text: "Get Premium",
                              onPress: () => router.push("/Subscription"), // Replace with your subscription page navigation
                            },
                            { text: "OK" },
                          ]
                        );
                      } else if (
                        (subscriptionType === "Premium_monthly" ||
                          subscriptionType === "Premium_yearly") &&
                        companyList.length >= 200
                      ) {
                        Alert.alert(
                          "Limit Reached",
                          "On premium account, you can add up to 200 companies only.",
                          [
                            {
                              text: "Get Premium",
                              onPress: () => router.push("/Subscription"), // Replace with your subscription page navigation
                            },
                            { text: "OK" },
                          ]
                        );
                      } else {
                        setShowAddCompanyModal(true);
                        setErrorMessage("");
                      }
                    } catch (error) {
                      console.error("Failed to check company limit:", error);
                    }
                  }}
                  style={[styles.option, { backgroundColor: "#00397A" }]}
                >
                  <Text style={styles.optionText}>Add Company</Text>
                </TouchableOpacity>
              )}
              {/* 
              {isActivityDropdown && !isEmployee && (
                <TouchableOpacity
                  onPress={() => {
                    setShowAddActivityModal(true);
                  }}
                  style={[styles.option, { backgroundColor: "#00397A" }]}
                >
                  <Text style={styles.optionText}>Add Activity</Text>
                </TouchableOpacity>
              )} */}
              {isTeamDropdown && !isEmployee && (
                <TouchableOpacity
                  onPress={() => setIsMakeTeamModalVisible(true)}
                  style={[styles.option, { backgroundColor: "#00397A" }]}
                >
                  <Text style={styles.optionText}>Invite Member</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
      {showAddCompanyModal && (
        <Modal
          transparent
          animationType="slide"
          visible={showAddCompanyModal}
          onRequestClose={() => handleCloseModal()}
          onDismiss={() => console.log("Modal closed")}
          onShow={() => console.log("Modal opened")}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowAddCompanyModal(false)}
          >
            <View style={styles.addCompanyModal}>
              {!userName && (
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  placeholderTextColor="#000"
                  value={enterUserName}
                  onChangeText={setEnterUserName}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Enter company name"
                placeholderTextColor="#000"
                value={newCompanyName}
                onChangeText={setNewCompanyName}
              />
              <TouchableOpacity
                onPress={handleAddCompany}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              {errorMessage ? (
                <Text style={{ color: "red" }}>{errorMessage}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {showAddActivityModal && (
        <Modal
          transparent
          animationType="slide"
          visible={showAddActivityModal}
          onRequestClose={() => handleCloseModal()}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            // onPress={() => setShowAddActivityModal(false)}
          >
            <View style={styles.addActivityModal}>
              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Activity name"
                  placeholderTextColor="#000"
                  // value={newActivityName}
                  onChangeText={(value) => {
                    setNewActivityName({
                      label: value,
                      value: value,
                      type: "admin",
                    });
                  }}
                />
                {activityInputs.map((input, index) => (
                  <View
                    key={index}
                    style={[
                      styles.activityInputContainer,
                      styles.buttonContainer,
                    ]}
                  >
                    <TextInput
                      style={styles.input2}
                      placeholder="Compliance actioning"
                      placeholderTextColor="#000"
                      value={input.action}
                      onChangeText={(value) =>
                        handleActivityChange(index, "action", value)
                      }
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentDateIndex(index);
                        setShowDatePicker(true);
                      }}
                      style={styles.input3}
                    >
                      <Text style={{ color: "#000" }}>
                        {input.dueDate.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={{ marginBottom: 14 }}>
                  <Button title="Add More Data" onPress={handleAddActivity} />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => setShowAddActivityModal(false)}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveActivities}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>Save Activities</Text>
                  </TouchableOpacity>
                </View>
                {errorMessage ? (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                ) : null}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* {showDatePicker && (
      <DateTimePicker
        value={activityInputs[currentDateIndex]?.dueDate || new Date()}
        mode="date"
        display="default"
        onChange={onDateChange}
      />
    )} */}
      {/* <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdownButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#008DD2",
    borderRadius: 5,
    alignItems: "center",
  },
  dropdown: {
    // maxHeight: 250,
    width: 110,
  },
  buttonText: {
    fontSize: 10,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",

    // zIndex: 999,
  },
  modalContent: {
    position: "absolute",
    marginTop: 2,
    width: 82,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  option: {
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderBottomColor: "#1B3B60",
    backgroundColor: "#00a0e3",
    alignItems: "center",
  },
  optionText: {
    fontSize: 10,
    color: "white",
  },
  addCompanyModal: {
    width: "80%",
    height: "auto",
    backgroundColor: "#5290D7",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 40,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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
  input2: {
    width: 160,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#003067",
    borderRadius: 5,
    padding: 5,
    marginBottom: 6,
    color: "black",
    backgroundColor: "#FFFFFF",
  },
  input3: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#003067",
    borderRadius: 5,
    padding: 5,
    marginBottom: 6,
    color: "black",
    backgroundColor: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#00397A",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  activityInputContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  addActivityModal: {
    width: "80%",
    height: "auto",
    maxHeight: "90%", // Adjust this to your needs
    backgroundColor: "#5290D7",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    maxHeight: "100%", // Adjust this to your needs
    width: "100%",
  },
});

export default Dropdown;
