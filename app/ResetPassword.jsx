import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter, useLocalSearchParams } from "expo-router";

import logo from "../assets/images/logo.png";

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email } = useLocalSearchParams();
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Call your API to reset the password here
      const response = await fetch(
        "https://cd-backend-1.onrender.com/api/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, email }), // Adjust as needed
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Navigate to the Login screen if the password is successfully reset
        router.replace("/Login");
      } else {
        Alert.alert("Error", data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            placeholderTextColor="#7E7E7E"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#7E7E7E"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: "80%",
    maxHeight: 200,
    aspectRatio: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 28,
    paddingTop: 80,
    shadowColor: "#002F67",
    shadowOffset: { width: 0, height: -28 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 40, // For Android shadow
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  bottomContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ResetPassword;
