import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';

const YearPicker = ({ options, onSelect, placeholder }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const handleSelect = (itemValue) => {
    setSelectedYear(itemValue);
    onSelect(itemValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <Picker
        selectedValue={selectedYear}
        style={styles.picker}
        onValueChange={(itemValue) => handleSelect(itemValue)}
      >
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default YearPicker;
