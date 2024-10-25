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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import logo from "../assets/images/logo.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://cd-backend-1.onrender.com/api/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Store token and user details in AsyncStorage
        await AsyncStorage.setItem("token", result.token);
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            name: result.user.name,
            email: result.user.email,
            userType: result.user.userType,
            subscriptionType: result.user.subscriptionType,
          })
        );
        await AsyncStorage.setItem("userName", result.user.name);
        // Redirect to home or other screen
        router.replace("/");
      } else {
        // Show error if login failed
        Alert.alert("Login Failed", result.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during login");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ paddingTop: 40, paddingLeft: 20 }}>
        <Text
          style={styles.signupLink}
          onPress={() => {
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back" size={30} color="#008DD2" />
        </Text>
      </View>

      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7E7E7E"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7E7E7E"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => {
              router.push("/ForgotPassword");
            }}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't Have An Account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => {
                  router.push("/Signup");
                }}
              >
                Sign Up
              </Text>
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
    flex: 1,
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
  forgotPassword: {
    color: "#0F76DE",
    textAlign: "right",
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
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
  signupContainer: {
    margin: 10,
    marginBottom: 28,
  },
  signupText: {
    color: "#7E7E7E",
  },
  signupLink: {
    color: "#0F76DE",
    fontWeight: "bold",
  },
});

export default DeleteAccount;
