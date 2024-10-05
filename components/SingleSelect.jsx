import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const SingleSelect = ({
  options,
  onSelect,
  selectedItem,
  placeholder,
  style,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (item) => {
    // Unselect if the same item is clicked
    if (selectedItem === item) {
      onSelect(null); // Unselect the item
    } else {
      onSelect(item); // Select the new item
    }
    setIsDropdownOpen(false); // Close the dropdown after selection/unselection
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
        <Text style={styles.placeholderText}>
          {selectedItem
            ? options.find((opt) => opt === selectedItem)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>
                {selectedItem === item ? "✓ " : ""}
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.dropdownList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#003067",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  placeholderText: {
    color: "#000",
  },
  dropdownList: {
    maxHeight: 150,
    borderColor: "#003067",
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: "#FFFFFF",
  },
  item: {
    padding: 10,
  },
  itemText: {
    color: "#000",
  },
});

export default SingleSelect;
