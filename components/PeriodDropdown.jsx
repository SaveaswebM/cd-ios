import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const PeriodDropdown = ({
  visible,
  setIsVisible,
  onClose,
  selectedActivityType,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  buttonRef,
}) => {
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

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
    const fetchYears = async () => {
      try {
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/yearData/years"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const formattedYears = data.map((items) => items.year);
        setYears(formattedYears);
        if (!selectedYear) {
          setSelectedYear(formattedYears[0]);
        }
      } catch (error) {
        console.error("Failed to fetch Years:", error);
        Alert.alert("Error", "Failed to load Years. Please try again later.");
      }
    };
    fetchYears();
  }, [selectedYear]);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({ top: py + height, left: px });
      });
    }
  }, [buttonRef]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    onClose(); // Close the modal after selection
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.modalContent,
              { top: dropdownPosition.top, left: dropdownPosition.left },
            ]}
          >
            <View style={styles.yearSelector}>
              {selectedYear ? (
                <Text style={styles.label}>Year : {selectedYear}</Text>
              ) : (
                <Text style={styles.label}> Select Year :</Text>
              )}

              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={`${year}`} value={year} />
                ))}
              </Picker>
            </View>
            <View style={styles.monthList}>
              {selectedActivityType === "Monthly" &&
                months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthItem,
                      selectedMonth === month && styles.selectedMonthItem,
                    ]}
                    onPress={() => handleMonthSelect(month)}
                  >
                    <Text style={styles.monthText}>{month}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
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
    backgroundColor: "#00a0e3",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 0,
    position: "absolute",
  },
  yearSelector: {
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 1,
    paddingHorizontal: 2,
  },
  picker: {
    height: 50,
    color: "#00397A",
  },
  monthList: {
    backgroundColor: "#00a0e3",
    borderRadius: 10,
  },
  monthItem: {
    paddingVertical: 4,
    alignItems: "center",
    borderBottomWidth: 0,
    borderBottomColor: "#00a0e3",
  },
  selectedMonthItem: {
    backgroundColor: "#00397A",
  },
  monthText: {
    fontSize: 12,
    color: "white",
  },
});

export default PeriodDropdown;
