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
import Icon from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import logo from "../assets/images/logo.png";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("Admin");
  const [subscriptionType, setSubscriptionType] = useState("Free");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://cd-backend-1.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            userType,
            subscriptionType,
            subscriptionAmount,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Signup Successful", "You can now log in.");
        router.replace("/Login");
      } else {
        Alert.alert("Signup Failed", result.error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during signup");
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
            style={styles.input2}
            placeholder="Name"
            placeholderTextColor="#7E7E7E"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input2}
            placeholder="Email"
            placeholderTextColor="#7E7E7E"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7E7E7E"
              secureTextEntry={!passwordVisible} // Toggle visibility
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "visibility-off" : "visibility"}
                size={24}
                color="#7E7E7E"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#7E7E7E"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Icon
                name={confirmPasswordVisible ? "visibility-off" : "visibility"}
                size={24}
                color="#7E7E7E"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Already Have An Account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => {
                  router.replace("/Login");
                }}
              >
                Log In
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
    paddingVertical: 40,
    paddingHorizontal: 28,
    paddingTop: 80,
    shadowColor: "#002F67",
    shadowOffset: { width: 0, height: -28 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  input2: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  iconContainer: {
    paddingRight: 10,
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
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: "auto",
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
  },
});

export default Signup;
