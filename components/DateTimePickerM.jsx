import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useState } from "react";
import { View, StyleSheet, Modal, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function DateTimePickerM({
  dateTimePickerVisibleM,
  setDateTimePickerVisibleM,
  selectedDatePicker,
  setSelectedDatePicker,
  setDatePickerData,
  dateObject,
  setDateObject,
}) {
  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="slide"
        visible={dateTimePickerVisibleM}
        onRequestClose={() => setDateTimePickerVisibleM(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              mode="single"
              date={selectedDatePicker}
              onChange={async (params) => {
                setDateObject(params);
                setSelectedDatePicker(params.date);
              }}
            />
          </View>
        </View>
        <Button
          title="Ok"
          color="#00a0e5"
          onPress={() => {
            setDateTimePickerVisibleM(false);
            setDatePickerData();
            console.log(dateObject);
          }}
          style={{ backgroundColor: "#000" }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
