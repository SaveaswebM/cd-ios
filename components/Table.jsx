import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const { width: screenWidth } = Dimensions.get("window");

const MyTable = ({
  companyName,
  selectedActivity,
  selectedYear,
  selectedMonth,
  tableData,
  setTableData,
  name,
  selectedActivityType,
  isEmployee
}) => {
  const [isDataReadyToSave, setIsDataReadyToSave] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableHead = [
    "Compliance Actioning",
    "Due Date",
    "Completed By",
    "Preferred Date"
  ];
  const columnWidths = [
    screenWidth * 0.38,
    screenWidth * 0.18,
    screenWidth * 0.22,
    screenWidth * 0.2
  ];
  const BlinkingBackground = ({ children, blink, width }) => {
    const [isBlinking, setIsBlinking] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 1000); // Blink every second

      return () => clearInterval(interval);
    }, []);

    return (
      <View
        style={[
          styles.cellContainer,
          { width: width }, // Ensure consistent width
          isBlinking && blink
            ? styles.blinkingBackground
            : styles.defaultBackground
        ]}
      >
        {children}
      </View>
    );
  };
  // useEffect(() => {
  //   // Create table on component mount
  //   const setupDatabase = async () => {
  //     await createTable();
  //   };
  //   setupDatabase();
  // }, []);

  useEffect(() => {
    // Fetch data from API
    const fetchApiData = async () => {
      try {
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/data"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFetchedData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to load data. Please try again later.");
      }
    };
    if (!isEmployee) {
      fetchApiData();
    }
  }, []);
  useEffect(() => {
    if (selectedActivity && selectedYear && selectedMonth && !isEmployee) {
      let activityData = [];
      if (selectedActivityType === "Monthly") {
        activityData =
          fetchedData.Monthly?.[selectedActivity]?.[selectedYear]?.[
            selectedMonth
          ] || [];
      } else if (selectedActivityType === "Quarterly") {
        activityData =
          fetchedData.Quarterly?.[selectedActivity]?.[selectedYear]?.[
            selectedMonth
          ] || [];
      } else if (selectedActivityType === "Yearly") {
        activityData =
          fetchedData.Yearly?.[selectedActivity]?.[selectedYear] || [];
      }
      const formattedTableData = activityData.map((entry) => [
        entry.name,
        entry.dueDate,
        "",
        "" // Completed By and Preferred Date will be filled by user
      ]);
      // const storedata = storeDataInSQLite(formattedTableData);
      // console.log(storedata);
      setTableData(formattedTableData);
    }
  }, [selectedActivity, selectedYear, selectedMonth, fetchedData]);
  // useEffect(() => {
  //   // Fetch data from SQLite when filters change
  //   const fetchSQLiteData = async () => {
  //     try {
  //       if (
  //         selectedActivity &&
  //         selectedYear &&
  //         selectedMonth &&
  //         companyName &&
  //         tableData.length > 0
  //       ) {
  //         const data = await fetchData(
  //           companyName,
  //           selectedActivity,
  //           selectedYear,
  //           selectedMonth
  //         );
  //         setTableData(data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch data from SQLite:", error);
  //     }
  //   };

  //   fetchSQLiteData();
  // }, [companyName, selectedActivity, selectedYear, selectedMonth]);

  const getdatafromupdatedlink = async (datakey) => {
    try {
      const getlink = await AsyncStorage.getItem(
        isEmployee ? "employeeLink" : "links"
      );
      if (getlink) {
        response = await fetch(
          `https://cd-backend-1.onrender.com/api/link-data?link=${getlink}`
        );
        if (response.ok) {
          console.log("its workkkkkkkkkkkkk");
          const result = await response.json();
          if (result) {
            const linkData = result.data;
            for (const key in linkData) {
              if (linkData.hasOwnProperty(key)) {
                if (datakey === key) {
                  const value = JSON.stringify(linkData[key]);
                  await AsyncStorage.setItem(datakey, value);
                  // console.log(datakey, value);
                }
              }
            }
          }
        }
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // Check if data exists in AsyncStorage first
  //       if (selectedActivity && selectedYear && selectedMonth) {
  //         if (selectedActivityType === "Yearly") {
  //           await getdatafromupdatedlink(
  //             `${companyName}_${selectedActivity}_${selectedYear}`
  //           );
  //           // storedData = await AsyncStorage.getItem(
  //           //   `${companyName}_${selectedActivity}_${selectedYear}`
  //           // );
  //         } else {
  //           await getdatafromupdatedlink(
  //             `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
  //           );
  //           // storedData = await AsyncStorage.getItem(
  //           //   `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
  //           // );
  //         }
  //       }

  //       // If data from API exists, use it instead of the stored data
  //       // if (apiData) {
  //       //   storedData = apiData;
  //       // }

  //       // If we have stored data from either AsyncStorage or the API
  //       // if (storedData) {
  //       //   setTableData(JSON.parse(storedData));
  //       //   setCurrentPage(1);
  //       // }
  //     } catch (error) {
  //       console.log("Error loading data from AsyncStorage or API:", error);
  //     }
  //   };

  //   loadData();
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        let storedData;

        // Check if data exists in AsyncStorage first
        if (selectedActivityType === "Yearly") {
          if (companyName && selectedActivity && selectedYear) {
            await getdatafromupdatedlink(
              `${companyName}_${selectedActivity}_${selectedYear}`
            );
          }
          storedData = await AsyncStorage.getItem(
            `${companyName}_${selectedActivity}_${selectedYear}`
          );
        } else {
          if (
            companyName &&
            selectedActivity &&
            selectedYear &&
            selectedMonth
          ) {
            await getdatafromupdatedlink(
              `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
            );
          }
          storedData = await AsyncStorage.getItem(
            `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
          );
        }

        // If data from API exists, use it instead of the stored data
        // if (apiData) {
        //   storedData = apiData;
        // }

        // If we have stored data from either AsyncStorage or the API
        if (storedData) {
          setTableData(JSON.parse(storedData));
          setCurrentPage(1);
        }
      } catch (error) {
        console.log("Error loading data from AsyncStorage or API:", error);
      }
    };

    loadData();
  }, [companyName, selectedActivity, selectedYear, selectedMonth]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       let storedData;

  //       if (selectedActivityType === "Yearly") {
  //         storedData = await AsyncStorage.getItem(
  //           `${companyName}_${selectedActivity}_${selectedYear}`
  //         );
  //         if (isEmployee) {
  //         const res =   getdatafromupdatedlink(
  //             `${companyName}_${selectedActivity}_${selectedYear}`
  //           );
  //         }
  //       } else {
  //         storedData = await AsyncStorage.getItem(
  //           `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
  //         );
  //         if (isEmployee) {
  //           getdatafromupdatedlink(
  //             `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`
  //           );
  //         }
  //       }

  //       if (storedData) {
  //         setTableData(JSON.parse(storedData));
  //         setCurrentPage(1);
  //       }
  //     } catch (error) {
  //       console.log("Error loading data from AsyncStorage:", error);
  //     }
  //   };

  //   loadData();
  // }, [companyName, selectedActivity, selectedYear, selectedMonth]);
  useEffect(() => {
    const loadData = async () => {
      let storedData;

      if (selectedActivityType === "admin") {
        // Check if the data is already formatted and stored
        const tdata = await AsyncStorage.getItem(
          `${companyName}_${selectedActivity}`
        );

        if (!tdata || JSON.parse(tdata).length === 0) {
          // If not formatted or empty, proceed to format and store it
          const getTableDataString = await AsyncStorage.getItem(
            `${selectedActivity}`
          );

          if (getTableDataString) {
            const getTableData = JSON.parse(getTableDataString);

            console.log("getTableData for admin", getTableData);

            const formattedTableData = getTableData.map((entry) => {
              const date = new Date(entry.dueDate);
              const formattedDate = date.toISOString().split("T")[0];

              return [
                entry.action,
                formattedDate,
                "", // Completed By will be filled by user
                "" // Preferred Date will be filled by user
              ];
            });

            console.log("Formatted Table Data", formattedTableData);

            // Save the formatted data
            await AsyncStorage.setItem(
              `${companyName}_${selectedActivity}`,
              JSON.stringify(formattedTableData)
            );

            // Set the storedData to formattedTableData for later use
            storedData = formattedTableData;
          }
        } else {
          // If formatted data already exists, use it
          storedData = JSON.parse(tdata);
          console.log("stored data already:", storedData);
        }
      }

      if (storedData) {
        setTableData(storedData);
      }
    };

    loadData();
  }, [companyName, selectedActivity]);

  const sharelinkData = async (skey, tableData) => {
    try {
      const getlink = await AsyncStorage.getItem(
        isEmployee ? "employeeLink" : "links"
      );

      if (getlink) {
        // console.log("getlink", getlink);
        const payload = {
          link: getlink,
          data: {
            [skey]: tableData // Stringify tableData to send as JSON
          }
        };
        console.log(JSON.stringify(payload));
        // Send the payload to your backend
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/link-data",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );

        // Handle the response
        if (response.ok) {
          const result = await response.json();
          console.log("Success", "Link shared and saved successfully.", result);
        } else {
          console.error("Failed to share the link, response not OK");
        }
      } else {
        console.error("No link found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error sharing link:", error);
    }
  };

  useEffect(() => {
    const saveData = async () => {
      try {
        const loginToken = await AsyncStorage.getItem("token");
        if (selectedActivityType === "admin") {
          await AsyncStorage.setItem(
            `${companyName}_${selectedActivity}`,
            JSON.stringify(tableData)
          );

          await sharelinkData(`${companyName}_${selectedActivity}`, tableData);

          // console.log("store admin data : ", tableData);
        } else if (selectedActivityType === "Yearly") {
          await AsyncStorage.setItem(
            `${companyName}_${selectedActivity}_${selectedYear}`,
            JSON.stringify(tableData)
          );

          await sharelinkData(
            `${companyName}_${selectedActivity}_${selectedYear}`,
            tableData
          );
        } else {
          await AsyncStorage.setItem(
            `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`,
            JSON.stringify(tableData)
          );

          await sharelinkData(
            `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`,
            tableData
          );
        }
      } catch (error) {
        console.log("Error saving data to AsyncStorage:", error);
      }
    };

    if (isDataReadyToSave) {
      saveData();
    }
  }, [tableData]);

  useEffect(() => {
    const saveData = async () => {
      try {
        const loginToken = await AsyncStorage.getItem("token");
        // const ;
        let key;
        if (selectedActivityType === "admin") {
          key = `${companyName}_${selectedActivity}`;
        } else if (selectedActivityType === "Yearly") {
          key = `${companyName}_${selectedActivity}_${selectedYear}`;
        } else if (selectedActivityType === "Monthly") {
          key = `${companyName}_${selectedActivity}_${selectedYear}_${selectedMonth}`;
        }
        if (key) {
          await AsyncStorage.setItem(key, JSON.stringify(tableData));
          console.log("Data saved to AsyncStorage with key:", key);
        }
        if (loginToken) {
          const userData = await AsyncStorage.getItem("user");
          const user = JSON.parse(userData);
          const email = user.email;
          const checkResponse = await fetch(
            "https://cd-backend-1.onrender.com/",
            {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                key,
                companyName,
                activityName: selectedActivity,
                yaer: selectedYear || null,
                month: selectedMonth || null,
                selectedActivityType,
                data: JSON.stringify(tableData),
                email
              })
            }
          );
          const checkData = await checkResponse.json();

          if (checkResponse.ok && checkData.length > 0) {
            const updateResponse = await fetch(
              "https://cd-backend-1.onrender.com/",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json"
                },
                body: JSON.stringify({
                  key,
                  companyName,
                  activityName: selectedActivity,
                  yaer: selectedYear || null,
                  month: selectedMonth || null,
                  selectedActivityType,
                  data: JSON.stringify(tableData),
                  email
                })
              }
            );

            const updateResult = await updateResponse.json();
            if (updatedResponse.ok) {
              console.log("data has been updated");
            } else {
              console.log("failed to update data in backend");
            }
          }
        }
      } catch (error) {}
    };
  }, [tableData]);

  // const storeDataInSQLite = async (data) => {
  //   try {
  //     await insertData(
  //       companyName,
  //       selectedActivity,
  //       selectedYear,
  //       selectedMonth,
  //       data
  //     );
  //   } catch (error) {
  //     console.error("Failed to insert data into SQLite:", error);
  //   }
  // };

  // const handleDataUpdate = async (rowIndex, columnIndex, value) => {
  //   try {
  //     const updatedData = [...tableData];
  //     const id = updatedData[rowIndex].id; // Assuming each row has an 'id' field

  //     // Update the specific cell in the tableData state
  //     updatedData[rowIndex][columnIndex] = value;
  //     setTableData(updatedData);

  //     // Map columnIndex to your database column names
  //     const columnNames = [
  //       "complianceActioning", // Column 0
  //       "dueDate", // Column 1
  //       "completedBy", // Column 2
  //       "preferredDate", // Column 3
  //     ];
  //     const columnName = columnNames[columnIndex];

  //     // Update the specific field in SQLite
  //     await updateData(id, columnName, value);
  //   } catch (error) {
  //     console.error("Failed to update data:", error);
  //     Alert.alert("Error", "Failed to update data. Please try again later.");
  //   }
  // };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);

    if (date) {
      const updatedData = [...tableData];
      updatedData[selectedRowIndex][3] = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      setTableData(updatedData);

      // Call handleDataUpdate here to save the change in SQLite if needed
      // handleDataUpdate(selectedRowIndex, 3, selectedDate);
    }
    hideDatePicker();
  };
  const handleCompletedClick = (rowIndex) => {
    Alert.alert("Mark as Completed", "Do you want to mark as completed?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => {
          const updatedData = [...tableData];

          // Define completedValue based on the name
          const completedValue = name === "" ? "admin" : name;

          updatedData[rowIndex][2] = completedValue;
          setTableData(updatedData);
          setIsDataReadyToSave(true);
          // Call handleDataUpdate with the appropriate value
          // handleDataUpdate(rowIndex, 2, completedValue);
        }
      }
    ]);
  };

  const handlePreferredDateClick = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setDatePickerVisibility(true);
  };

  const onDateChange = (event, selectedDate) => {
    setDatePickerVisibility(false);
    if (event.type === "dismissed") {
      // The user canceled the picker
      setShowPicker(false);
      return;
    }
    if (selectedDate) {
      const updatedData = [...tableData];
      updatedData[selectedRowIndex][3] = selectedDate
        .toISOString()
        .split("T")[0]; // Format date as YYYY-MM-DD
      setTableData(updatedData);

      // Call handleDataUpdate here to save the change in SQLite if needed
      // handleDataUpdate(selectedRowIndex, 3, selectedDate);
    }
  };

  const getMonthName = (monthIndex) => {
    const months = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    return months[monthIndex];
  };
  const renderCell = (data, columnIndex, Index) => {
    let rowIndex = Index + (currentPage - 1) * itemsPerPage;
    let cellStyle = styles.cell;

    if (columnIndex === 1) {
      const today = new Date();
      const dueDate = new Date(data);
      const differenceInMs = dueDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

      const completedValue = tableData[rowIndex][2];

      const day = dueDate.getDate();
      const month = dueDate.getMonth(); // Get the month index
      const formattedDay =
        day +
        (day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
          ? "rd"
          : "th");
      const monthName =
        selectedActivityType === "Yearly" || selectedActivityType === "Qaterly"
          ? getMonthName(month) + " "
          : " ";
      if (remainingDays <= 5 && remainingDays >= 0 && completedValue === "") {
        return (
          <BlinkingBackground blink={true} width={columnWidths[columnIndex]}>
            <View>
              <Text style={styles.blinkingCell}>
                {formattedDay} {monthName}
              </Text>
            </View>
          </BlinkingBackground>
        );
      }
      cellStyle = completedValue
        ? styles.dueDateCompletedCell
        : styles.dueDateCell;

      return (
        <View
          key={columnIndex}
          style={[
            styles.cellContainer,
            cellStyle,
            { width: columnWidths[columnIndex], height: "auto" }
          ]}
        >
          <Text style={[styles.cellText, { color: "white" }]}>
            {formattedDay} {monthName}
          </Text>
        </View>
      );
    }

    if (columnIndex === 2) {
      return (
        <TouchableOpacity
          key={columnIndex}
          style={[
            styles.cellContainer,
            { width: columnWidths[columnIndex], height: "auto" }
          ]}
          onPress={() => data === "" && handleCompletedClick(rowIndex)}
        >
          <Text style={styles.cellText}>{data}</Text>
        </TouchableOpacity>
      );
    }

    if (columnIndex === 3) {
      return (
        <TouchableOpacity
          key={columnIndex}
          style={[
            styles.cellContainer,
            { width: columnWidths[columnIndex], height: "auto" }
          ]}
          onPress={() => handlePreferredDateClick(rowIndex)}
        >
          <TextInput
            style={[styles.cellText, { fontSize: 12 }]}
            editable={false}
            value={data}
            placeholder="Add Date"
          />
        </TouchableOpacity>
      );
    }

    return (
      <View
        key={columnIndex}
        style={[
          styles.cellContainer,
          { width: columnWidths[columnIndex], height: "auto" }
        ]}
      >
        <Text style={[styles.cellText, cellStyle]}>{data}</Text>
        {/* {isDatePickerVisible && (
          <DateTimePickerModal
            style={[{ color: "black" }]}
            value={new Date()}
            mode="date"
            display="default"
            
            isVisible={isDatePickerVisible}
          
            onConfirm={onDateChange}
            onCancel={setDatePickerVisibility(false)}
          />
        )} */}

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };
  const renderPaginationControls = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled
        ]}
      >
        <Text
          style={[
            styles.paginationText,
            currentPage === 1 && styles.paginationTextDisabled
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <Text style={[styles.paginationText, { color: "#000" }]}>
        Page {currentPage} of {totalPages}
      </Text>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationButtonDisabled
        ]}
      >
        <Text
          style={[
            styles.paginationText,
            currentPage === totalPages && styles.paginationTextDisabled
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.table}>
          <View style={styles.row}>
            {tableHead.map((header, index) => (
              <View
                key={index}
                style={[
                  styles.cellContainer,
                  styles.headingCell,
                  { width: columnWidths[index] }
                ]}
              >
                <Text style={styles.headText}>{header}</Text>
              </View>
            ))}
          </View>
          {currentData.map((rowData, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {rowData.map((cellData, cellIndex) =>
                renderCell(cellData, cellIndex, rowIndex)
              )}
            </View>
          ))}
        </View>
      </View>
      {/* Add the pagination controls below the table */}
      {renderPaginationControls()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  table: { flex: 1, width: "100%" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  cellContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd"
  },
  headingCell: { height: 74, backgroundColor: "#0D3B66" }, // Fixed height for headings
  cellText: {
    textAlign: "center",
    padding: 8,
    fontSize: 12,
    paddingHorizontal: 2,
    color: "black"
  },
  headText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    padding: 2,
    color: "#fff"
  },
  blinkingCell: {
    color: "white",
    fontWeight: "semibold",
    textAlign: "center"
    // padding: 100,
    // paddingHorizontal: 10,
  },
  dueDateCell: {
    backgroundColor: "#FE0000",
    color: "white"
    // paddingHorizontal: 10,
    // margin: 0,
  },
  dueDateCompletedCell: {
    backgroundColor: "#00D36A",
    color: "white"
    // paddingHorizontal: 10,
  },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    alignItems: "center"
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5
  },
  closeButtonText: { color: "white", fontSize: 16 },
  blinkingBackground: {
    backgroundColor: "#FE0000"
  },
  duedateContainer: {
    backgroundColor: "#f8d7da"
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },
  paginationButton: {
    padding: 10,
    paddingVertical: 6,
    backgroundColor: "#00A0E3",

    borderRadius: 5,
    marginHorizontal: 5
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc"
  },
  paginationText: {
    fontSize: 14,
    color: "#fff"
  },
  paginationTextDisabled: {
    color: "#000"
  }
});

export default MyTable;
