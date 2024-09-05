import React, { useRef, useState } from "react";
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

const OtpReset = () => {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const { email } = useLocalSearchParams();

  const handleChangeText = (text, index) => {
    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Update the OTP array
    const newOtpArray = [...otpArray];
    newOtpArray[index] = text;
    setOtpArray(newOtpArray);
  };

  const handleConfirm = async () => {
    const otp = otpArray.join(""); // Join the array to form the complete OTP

    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(
        "https://cd-backend-1.onrender.com/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const text = await response.text(); // Read response as text first
      console.log("Response Text:", text); // Log the response text

      let data;
      try {
        data = JSON.parse(text); // Attempt to parse as JSON
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }

      if (response.ok) {
        router.replace(`/ResetPassword?email=${encodeURIComponent(email)}`);
      } else {
        Alert.alert("Error", data?.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
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
        <View style={styles.heading}>
          <Text style={[styles.text, styles.mainText]}>
            Please check your e-mail
          </Text>
        </View>
        <View style={styles.subHeading}>
          <Text style={styles.text}>
            We have sent a 6-digit verification code
          </Text>
        </View>
        <View style={styles.inputContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholderTextColor="#000"
              keyboardType="numeric"
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              onChangeText={(text) => handleChangeText(text, index)}
            />
          ))}
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupContainer}>
            <Text style={styles.signupText}>
              <Text style={styles.signupLink}>Resend code</Text>
            </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 5,
  },
  text: {
    color: "#000",
  },
  mainText: {
    fontSize: 24,
  },
  heading: {
    marginBottom: 24,
  },
  subHeading: {
    marginBottom: 24,
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
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
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: "#7E7E7E",
  },
  signupLink: {
    color: "#0F76DE",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default OtpReset;
