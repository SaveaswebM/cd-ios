import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const MultiSelect = ({ options, onSelect, selectedItems, placeholder, style }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem.value === item.value);
    const newSelectedItems = isSelected
      ? selectedItems.filter(selectedItem => selectedItem.value !== item.value)
      : [...selectedItems, item];

    onSelect(newSelectedItems);
    // console.log(newSelectedItems);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
        <Text style={styles.placeholderText}>
          {selectedItems.length > 0
            ? selectedItems.map(item => options.find(opt => opt.value === item.value)?.label).join(', ')
            : placeholder}
        </Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>
                {selectedItems.some(selectedItem => selectedItem.value === item.value) ? "✓ " : ""}{item.label}
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
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#003067',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  placeholderText: {
    color: '#000',
  },
  dropdownList: {
    maxHeight: 150,
    borderColor: '#003067',
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: '#FFFFFF',
  },
  item: {
    padding: 10,
  },
  itemText: {
    color: '#000',
  },
});

export default MultiSelect;
