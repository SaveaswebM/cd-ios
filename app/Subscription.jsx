import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Premium from "../assets/images/premium.png";
import Standard from "../assets/images/standard.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import * as RNIap from "react-native-iap";
import AsyncStorage from "@react-native-async-storage/async-storage";

const itemSubs = Platform.select({
  ios: ["your_product_id"],

  android: [
    "com.thirdeyetechlabs.compliancediary.standard_1",
    "com.thirdeyetechlabs.compliancediary.premium_1",
  ],
});

const Subscription = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   IAP.getProducts(itemSkus).then((res) => {
  //     console.log(res);
  //   });
  // }, []);
  // useEffect(() => {
  //   const initIAP = async () => {
  //     try {
  //       await initConnection();
  //       const availableProducts = await getSubscriptions({ skus: itemSkus });
  //       console.log(availableProducts);
  //       setProducts(availableProducts);
  //     } catch (e) {
  //       console.error("Error initializing IAP:", e);
  //     }
  //   };

  //   const tokenCheck = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     setIsLoggedIn(!!token);
  //   };

  //   tokenCheck();
  //   initIAP();

  //   const purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
  //     // Handle successful purchases here
  //     console.log("Purchase updated:", purchase);
  //   });

  //   const purchaseErrorSubscription = purchaseErrorListener((error) => {
  //     console.error("Purchase error:", error);
  //   });

  //   return () => {
  //     purchaseUpdateSubscription.remove();
  //     purchaseErrorSubscription.remove();
  //   };
  // }, []);
  useEffect(() => {
    initilizeIAPConnection();
  }, []);

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()

      .then(async (connection) => {
        console.log("IAP result", connection);

        getItems();
      })

      .catch((err) => {
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });

    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()

      .then(async (consumed) => {
        console.log("consumed all items?", consumed);
      })
      .catch((err) => {
        console.warn(
          `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
          err.message
        );
      });
  };
  const getItems = async () => {
    try {
      console.log("itemSubs ", itemSubs);

      const Products = await RNIap.getSubscriptions(itemSubs);

      console.log(" IAP Su", Products);
      Alert.alert(" IAP Su", Products);
      if (Products.length !== 0) {
        if (Platform.OS === "android") {
          //Your logic here to save the products in states etc
        } else if (Platform.OS === "ios") {
          // your logic here to save the products in states etc
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.warn("IAP error", err.code, err.message, err);

      setError(err.message);
    }
  };
  const handlePurchase = async (productId) => {
    if (isLoggedIn) {
      try {
        await requestSubscription(productId);
        console.log(`Purchase started for product: ${productId}`);
      } catch (e) {
        console.error("Error purchasing product:", e);
      }
    } else {
      // Redirect to login page if not logged in
      router.push("/Login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.card}>
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
                <Icon name="check-circle" size={18} color="#33363F" />
                <Text style={styles.text}>Number of companies - 03</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#33363F" />
                <Text style={styles.text}>Number of people - 10</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="times-circle" size={18} color="#33363F" />
                <Text style={styles.text}>No data backup</Text>
              </View>
            </View>
            <LinearGradient
              colors={["#6AB0FF", "#ABD2FF"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={() => navigation.navigate(index)}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={[styles.card, styles.card2]}>
            <LinearGradient
              colors={["#70B3FF", "#6C67E7"]}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1.0, y: 0.5 }}
              style={styles.packageName}
            >
              <Image source={Standard} style={styles.image} />
              <Text style={styles.packageText}>Standard Version</Text>
            </LinearGradient>
            <Text style={styles.versionName}>Rs 5,000/-</Text>
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#33363F" />
                <Text style={styles.text}>Number of companies - 05</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#33363F" />
                <Text style={styles.text}>Number of people - 50</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#33363F" />
                <Text style={styles.text}>Data backup</Text>
              </View>
            </View>
            <LinearGradient
              colors={["#6AB0FF", "#ABD2FF"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <TouchableOpacity
                onPress={() => handlePurchase("com.cooni.point5000")}
              >
                <Text style={styles.buttonText}>Get Standard</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={[styles.card, styles.card3]}>
            <LinearGradient
              colors={["#70B3FF", "#6C67E7"]}
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1.0, y: 0.5 }}
              style={styles.packageName}
            >
              <Image source={Premium} style={styles.image} />
              <Text style={styles.packageText}>Premium Version</Text>
            </LinearGradient>
            <Text style={styles.versionName}>Rs 10,000/-</Text>
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#fff" />
                <Text style={styles.text}>Number of companies - 50</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#fff" />
                <Text style={styles.text}>Number of people - 200</Text>
              </View>
              <View style={styles.textContainer}>
                <Icon name="check-circle" size={18} color="#fff" />
                <Text style={styles.text}>Data backup</Text>
              </View>
            </View>
            <LinearGradient
              colors={["#6AB0FF", "#ABD2FF"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.button}
            >
              <TouchableOpacity
                onPress={() => handlePurchase("com.cooni.point5000")}
              >
                <Text style={styles.buttonText}>Get Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
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
  card3: { backgroundColor: "#002E62" },
  text3: { color: "white" },
  versionName3: {
    color: "white",
    borderColor: "white",
  },
});
