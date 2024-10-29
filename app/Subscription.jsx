import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Button,
  SafeAreaView,
} from "react-native";
import React from "react";
import Header from "../components/Header";
// import Home from '../app/Home';
import Premium from "../assets/images/premium.png";
import standard from "../assets/images/standard.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "./redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Subscription = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.isLogin);
  async function startRazorpay() {
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: "INR",
      key: "rzp_test_vCQDlKcu1PydlH", // Your api key
      amount: "2999",
      name: "Compliance Diary",
      prefill: {
        email: "void@razorpay.com",
        contact: "9191919191",
        name: "Razorpay Software",
      },
      theme: { color: "#F37254" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  }

  const createSubscription = async (planId, planType) => {
    try {
      const response = await fetch(
        "https://cd-backend-1.onrender.com/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan_id: planId }),
        }
      );
      console.log(response);
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json(); // Use .json() to parse the response
      console.log(data);
      // Call handlePayment with the subscription ID
      handlePayment(data.id, planType);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const handlePayment = async (subscriptionId, planType) => {
    const user = await AsyncStorage.getItem("user");
    const parseduser = JSON.parse(user);
    const useremail = parseduser.email;
    const options = {
      key: "rzp_test_vCQDlKcu1PydlH",
      subscription_id: subscriptionId,
      handler: (response) => {
        console.log("Payment successful:", response);
      },
      prefill: {
        email: useremail,
      },
      theme: {
        color: "#008ed2",
      },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // Payment successful, handle the response
        console.log("Payment data:", data);
        if (
          data.razorpay_payment_id &&
          data.razorpay_signature &&
          data.razorpay_subscription_id &&
          planType &&
          useremail
        ) {
          savePaymentDetails(data, useremail, planType);
        }
      })
      .catch((error) => {
        console.error("Payment failed:", error);
      });
  };

  async function savePaymentDetails(data, useremail, planType) {
    console.log("useremail", useremail);
    console.log("useremail", planType);
    const response = await fetch(
      "https://cd-backend-1.onrender.com/update-subscription-after-payment",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          subscriptionType: planType,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
          razorpay_subscription_id: data.razorpay_subscription_id,
        }),
      }
    );
    if (response.ok) {
      const res = await response.json();
      console.log(res);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View>
              <LinearGradient
                colors={["#70B3FF", "#6C67E7"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                style={styles.packageName}
              >
                <Text style={styles.packageText}>Basic Version</Text>
              </LinearGradient>
              <Text style={styles.versionName}>Free</Text>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text]}>Number of companies - 03</Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text]}>
                    Number of Team members Per Company- 03
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="times-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text]}>No data backup</Text>
                </View>
              </View>
              <LinearGradient
                colors={["#6AB0FF", "#ABD2FF", "#7D98B7", "#3F6A9B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center", // Add this to control the width
                    paddingHorizontal: 16, // Adjust padding to control button width
                    paddingVertical: 4, // Adjust padding for vertical spacing
                    borderRadius: 15,
                  }}
                  onPress={() => navigation.navigate(index)}
                >
                  <Link href="/">
                    <Text style={styles.buttonText}>Continue</Text>
                  </Link>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <View style={[styles.card, styles.card2]}>
            <View>
              <LinearGradient
                colors={["#70B3FF", "#6C67E7"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                style={styles.packageName}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={standard}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.packageText}>Professional Monthly</Text>
                </View>
              </LinearGradient>
              <Text style={styles.versionName}>Rs 29/-</Text>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>
                    Number of companies - 10
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>
                    Number of Team Members Per Company, per activity - 05
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>Data backup</Text>
                </View>
              </View>
              <LinearGradient
                colors={["#6AB0FF", "#ABD2FF", "#7D98B7", "#3F6A9B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center", // Add this to control the width
                    paddingHorizontal: 16, // Adjust padding to control button width
                    paddingVertical: 4, // Adjust padding for vertical spacing
                    borderRadius: 15,
                  }}
                >
                  {isLogin ? (
                    <TouchableOpacity
                      onPress={() => {
                        createSubscription(
                          "plan_PDGrWcwegZno0i",
                          "Professional_monthly"
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Get Professional</Text>
                    </TouchableOpacity>
                  ) : (
                    <Link href="/Login">
                      <Text style={styles.buttonText}>Get Professional</Text>
                    </Link>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <View style={[styles.card, styles.card2]}>
            <View>
              <LinearGradient
                colors={["#70B3FF", "#6C67E7"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                style={styles.packageName}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={standard}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.packageText}>Professional Yearly</Text>
                </View>
              </LinearGradient>
              <Text style={styles.versionName}>Rs 299/-</Text>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>
                    Number of companies - 10
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>
                    Number of Team Members Per Company, per activity- 05
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#00a0e3"
                      style={{ color: "#33363F" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text2]}>Data backup</Text>
                </View>
              </View>
              <LinearGradient
                colors={["#6AB0FF", "#ABD2FF", "#7D98B7", "#3F6A9B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center", // Add this to control the width
                    paddingHorizontal: 16, // Adjust padding to control button width
                    paddingVertical: 4, // Adjust padding for vertical spacing
                    borderRadius: 15,
                  }}
                >
                  {isLogin ? (
                    <TouchableOpacity
                      onPress={() => {
                        createSubscription(
                          "plan_PDGs5hooGVPF8F",
                          "Professional_yearly"
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Get Professional</Text>
                    </TouchableOpacity>
                  ) : (
                    <Link href="/Login">
                      <Text style={styles.buttonText}>Get Professional</Text>
                    </Link>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <View style={[styles.card, styles.card3]}>
            <View>
              <LinearGradient
                colors={["#70B3FF", "#6C67E7"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                style={styles.packageName}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={Premium}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.packageText}>Premium Monthly</Text>
                </View>
              </LinearGradient>
              <Text style={[styles.versionName, styles.versionName3]}>
                Rs 299/-
              </Text>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>
                    Number of companies - 200
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>
                    Number of Team Members per Company, per activity - 07
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>Data backup</Text>
                </View>
              </View>
              <LinearGradient
                colors={["#6AB0FF", "#ABD2FF", "#7D98B7", "#3F6A9B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center", // Add this to control the width
                    paddingHorizontal: 16, // Adjust padding to control button width
                    paddingVertical: 4, // Adjust padding for vertical spacing
                    borderRadius: 15,
                  }}
                >
                  {isLogin ? (
                    <TouchableOpacity
                      onPress={() => {
                        createSubscription(
                          "plan_PCW6zP9nKaSZVE",
                          "Premium_monthly"
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Get Premium</Text>
                    </TouchableOpacity>
                  ) : (
                    <Link href="/Login">
                      <Text style={styles.buttonText}>Get Premium</Text>
                    </Link>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
          <View style={[styles.card, styles.card3]}>
            <View>
              <LinearGradient
                colors={["#70B3FF", "#6C67E7"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                style={styles.packageName}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={Premium}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.packageText}>Premium Yearly</Text>
                </View>
              </LinearGradient>
              <Text style={[styles.versionName, styles.versionName3]}>
                Rs 2,999/-
              </Text>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>
                    Number of companies - 200
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>
                    Number of Team Members Per Company, per activity- 07
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <TouchableOpacity style={styles.bar_icon}>
                    <Icon
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.text, styles.text3]}>Data backup</Text>
                </View>
              </View>
              <LinearGradient
                colors={["#6AB0FF", "#ABD2FF", "#7D98B7", "#3F6A9B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.button}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center", // Add this to control the width
                    paddingHorizontal: 16, // Adjust padding to control button width
                    paddingVertical: 4, // Adjust padding for vertical spacing
                    borderRadius: 15,
                  }}
                >
                  {isLogin ? (
                    <TouchableOpacity
                      onPress={() => {
                        createSubscription(
                          "plan_PDGqvE8p4hrsm1",
                          "Premium_yearly"
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Get Premium</Text>
                    </TouchableOpacity>
                  ) : (
                    <Link href="/Login">
                      <Text style={styles.buttonText}>Get Premium</Text>
                    </Link>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Subscription;
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#8CC2FF",
    width: "82%",
    // flex: 1,
    // alignItems: 'center',
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    // height: 241,
    elevation: 22,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 29,
  },
  image: { width: 18, height: 18, marginRight: 4 },
  imageContainer: { flexDirection: "row" },
  packageName: {
    marginHorizontal: "auto",
    color: "#002E62",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderColor: "#480061",
    borderWidth: 1,
  },
  packageText: { color: "#002E62", fontSize: 15, fontWeight: "semibold" },
  versionName: {
    marginHorizontal: "auto",
    marginVertical: 8,
    color: "#002E62",
    fontSize: 15,
    fontWeight: "semibold",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderColor: "#00234B",
    borderWidth: 1,
  },
  infoContainer: {},
  bar_icon: { marginRight: 10 },
  textContainer: {
    flexDirection: "row",
    marginVertical: 2,
  },
  text: { color: "#004A9D" },
  dropdownButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#00a0e3",
    borderRadius: 5,
    // borderWidth: 1,
    alignItems: "center",
  },
  button: {
    alignSelf: "center", // Add this to center the button
    // paddingHorizontal: 4,
    // paddingVertical: 8,
    borderRadius: 15,
    borderColor: "#00234B",
    borderWidth: 1,
    marginTop: 8,
  },
  buttonText: { color: "#002E62", fontSize: 15, fontWeight: "bold" },
  card2: { marginVertical: 12, backgroundColor: "#4182CB" },
  text2: { color: "black" },
  card3: { backgroundColor: "#002E62", marginBottom: 8 },
  text3: { color: "white" },
  versionName3: {
    color: "white",
    borderColor: "white",
  },
});
