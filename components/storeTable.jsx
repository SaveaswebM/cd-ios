import { View, Text } from "react-native";
import React, { useEffect } from "react";

const storeTable = (
  tableData,
  companyName,
  selectedActivity,
  selectedYear,
  selectedMonth,
  saveDataToStorage,
  loadDataFromStorage
) => {
  useEffect(() => {
    if (tableData.length > 0) {
      loadDataFromStorage(
        companyName,
        selectedActivity,
        selectedYear,
        selectedMonth
      );
    }
    // Call the async function to load the data
  }, [companyName, selectedActivity, selectedYear, selectedMonth]);

  useEffect(() => {
    if (true) {
      saveDataToStorage(
        companyName,
        selectedActivity,
        selectedYear,
        selectedMonth,
        tableData
      );
      // Reset flag after saving
    }
  }, [tableData, companyName, selectedActivity, selectedYear, selectedMonth]);

  return <View></View>;
};

export default storeTable;
