import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import logo from "../assets/images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(
        "https://cd-backend-1.onrender.com/api/otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", result.message, [
          {
            text: "OK",
            onPress: () =>
              router.replace(`/OtpReset?email=${encodeURIComponent(email)}`),
          },
        ]);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sending OTP");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <SafeAreaView style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7E7E7E"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    height: "100%",
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
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
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
    marginHorizontal: "auto",
  },
});

export default ForgotPassword;
