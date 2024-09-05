import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Clipboard,
  TouchableWithoutFeedback,
} from "react-native";
import UUID from "react-native-uuid";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import CustomDropdown from "./Dropdown";
// import * as Clipboard from "expo-clipboard";
import MultiSelect from "./MultiSelect"; // Ensure this import is correct

const MakeTeamModal = ({
  visible,
  onClose,
  companyNameOptions,
  groupOptions,
}) => {
  const [personName, setPersonName] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [uniqueLink, setUniqueLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Generate the unique link when both company and activities are selected
  useEffect(() => {
    if (selectedCompanyName && selectedGroups.length > 0) {
      generateUniqueLink();
    }
  }, [selectedCompanyName, selectedGroups]);

  const generateUniqueLink = () => {
    const uniqueId = UUID.v4();
    const activities = selectedGroups.join(",");
    const link = `yourapp://link?name=${encodeURIComponent(
      personName
    )}&company=${encodeURIComponent(
      selectedCompanyName
    )}&activities=${activities}&id=${uniqueId}`;
    setUniqueLink(link);
  };

  const handleSave = async () => {
    if (!personName || !selectedCompanyName || selectedGroups.length === 0) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      // Generate the unique link
      const baseUrl = "https://yourapp.com/share";
      const queryParameters = `?personName=${encodeURIComponent(
        personName
      )}&companyName=${encodeURIComponent(
        selectedCompanyName
      )}&groups=${encodeURIComponent(selectedGroups.join(", "))}`;
      const link = `${baseUrl}${queryParameters}`;

      // Share the link using the Linking API
      if (await Linking.canOpenURL(link)) {
        await Linking.openURL(link);
      } else {
        // Copy the link to the clipboard and show an alert
        await Clipboard.setStringAsync(link);
        Alert.alert(
          "Link Copied",
          "The link has been copied to your clipboard. You can paste it wherever you like."
        );
      }
    } catch (error) {
      console.error("Error sharing link:", error);
      Alert.alert(
        "Sharing Error",
        "An error occurred while trying to share the link."
      );
    }
    onClose();
  };

  const copyToClipboard = async (link) => {
    await Clipboard.setStringAsync(link);
    Alert.alert(
      "Link Copied",
      "The unique link has been copied to your clipboard."
    );
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
            <TextInput
              style={styles.input}
              placeholder="Enter Person Name"
              placeholderTextColor="#000"
              value={personName}
              onChangeText={setPersonName}
            />
            <View style={styles.fullWidthDropdown}>
              <CustomDropdown
                options={companyNameOptions}
                onSelect={(option) => setSelectedCompanyName(option.value)}
                placeholder={
                  selectedCompanyName ? selectedCompanyName : "Company Name"
                }
              />
            </View>
            <MultiSelect
              options={groupOptions}
              onSelect={setSelectedGroups}
              selectedItems={selectedGroups}
              placeholder="Select Activities"
              style={styles.fullWidthDropdown}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {uniqueLink ? (
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>{uniqueLink}</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(uniqueLink)}
                  style={styles.copyButton}
                >
                  <Text style={styles.copyButtonText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
  linkContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#00397A",
    marginBottom: 5,
  },
  copyButton: {
    backgroundColor: "#00397A",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default MakeTeamModal;
