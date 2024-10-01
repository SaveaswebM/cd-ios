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
import { DrawerContentScrollView } from "@react-navigation/drawer";

const DropdownTest = ({
    options,
    onSelect,
    isTeamDropdown,
    placeholder,
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
    selectedCompanyName,
    selectedActivityName,
    setIsMakeTeamModalVisible,
}) => {
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


  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [activityName, setActivityName] = useState('');

//   const handleAddActivity = () => {
//     setModalVisible(true); // Show modal to add a new activity
//   };


useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        } 
      } catch (error) {
        console.error("Failed to load user name from AsyncStorage", error);
      }
    };

    loadUserName();
  }, []);

  const handleSaveActivity = () => {
    if (activityName.trim()) {
      // Add the new activity to the dropdown items
      setItems((prevItems) => [
        ...prevItems,
        { label: activityName, value: activityName },
      ]);
      setValue(activityName); // Set the new activity as the selected value
      setModalVisible(false); // Hide modal after saving
      setActivityName(''); // Reset input field
    } else {
      alert("Activity name cannot be empty."); // Alert if input is empty
    }
  };
  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    // setIsVisible(false);
  };
  const handleCloseModal = () => {
    setShowAddCompanyModal(false);
    setErrorMessage("");
  };

  const handleAddActivity = () => {
    setActivityInputs([...activityInputs, { action: "", dueDate: new Date() }]);
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
    //   setIsVisible(false);
    }
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
  const handleActivityChange = (index, field, value) => {
    const newInputs = [...activityInputs];
    if (field === "dueDate") {
      newInputs[index][field] = value;
    } else {
      newInputs[index][field] = value;
    }
    setActivityInputs(newInputs);
  };

  const onDateChange = (event, selectedDate) => {
    const currentIndex = currentDateIndex;
    setShowDatePicker(false);
    if (selectedDate && currentIndex !== null) {
      handleActivityChange(currentIndex, "dueDate", selectedDate);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
      >
        {/* <Text style={styles.dropdownText}>
          {value ? value : "Select Activity"}
        </Text> */}
        {isTeamDropdown ? (
            <Text style={styles.buttonText}>{placeholder}</Text>
          ) : (
            <Text style={styles.buttonText}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>
          )}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {open && (
        <View style={styles.dropdownMenu}>
          {options.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.dropdownItem}
              onPress={() => {
           
                    handleSelect(item);
             
                setValue(item.value);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Button inside dropdown to add activity */}
          {isCompanyDropdown && !isEmployee && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const storedCompanyNames = await AsyncStorage.getItem(
                      "companyNames"
                    );
                    const companyList = JSON.parse(storedCompanyNames) || [];
                    const token = await AsyncStorage.getItem("token");
           
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
                    }
           
                    else {
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
    
            {isActivityDropdown && !isEmployee && (
              <TouchableOpacity
                onPress={() => {
                  setShowAddActivityModal(true);
                }}
                style={[styles.option, { backgroundColor: "#00397A" }]}
              >
                <Text style={styles.optionText}>Add Activity</Text>
              </TouchableOpacity>
            )}
            {isTeamDropdown && !isEmployee && (
              <TouchableOpacity
                onPress={() => setIsMakeTeamModalVisible(true)}
                style={[styles.option, { backgroundColor: "#00397A" }]}
              >
                <Text style={styles.optionText}>Invite Member</Text>
              </TouchableOpacity>
            )}
        </View>
      )}

      {/* Modal for adding new activity */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Activity</Text>
            <TextInput
              style={styles.input}
              placeholder="Activity Name"
              value={activityName}
              onChangeText={setActivityName}
            />
            <Button title="Save Activity" onPress={handleSaveActivity} />
            <Button title="Cancel" onPress={() => {
              setModalVisible(false);
              setActivityName(''); // Reset input field on cancel
            }} />


            
          </View>
        </View>
      </Modal>







      {showAddCompanyModal && (
      <Modal
        transparent
        animationType="slide"
                  visible={showAddCompanyModal}
        onRequestClose={() => handleCloseModal()}
    
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
    
    {showDatePicker && (
      <DateTimePicker
        value={activityInputs[currentDateIndex]?.dueDate || new Date()}
        mode="date"
        display="default"
        onChange={onDateChange}
      />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 2,
  },
  dropdown: {
    padding: 15,
    // width:"100%",
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 12,
  },
  buttonText: {
    fontSize: 10,
    color: "black",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    width: '100%',
    zIndex: 1, // Ensure it appears above other elements
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 12,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    
    // zIndex: 999, 
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
});

export default DropdownTest;
