import React, { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import logo from "../assets/images/logo.png"; // Ensure the path is correct
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Header = ({ isEmployee }) => {
  const pathname = usePathname(); // Get the current pathname
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-width * 0.75)).current;
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const toggleDrawer = () => {
    const toValue = drawerVisible ? -width * 0.75 : 0;
    setDrawerVisible(!drawerVisible);

    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await AsyncStorage.getItem("userName");
      const token = await AsyncStorage.getItem("token");
      if (username) {
        setPersonName(username);
      }
      if (token) {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const name = user.name;
          const email = user.email;
          setPersonName(name);
          setPersonEmail(email);
        }
      }
      setIsLoggedIn(!!token); // Set isLoggedIn based on whether the token exists
    };
    fetchUsername();
  }, []);
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token"); // Remove the token from AsyncStorage
    setIsLoggedIn(false); // Update the login status
    // setDrawerVisible(false); // Close the drawer after logout
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          {pathname === "/" ? ( // Check if the current pathname is the homepage
            !isEmployee && (
              <TouchableOpacity style={styles.barIcon} onPress={toggleDrawer}>
                <Icon name="bars" size={30} color="#008DD2" />
              </TouchableOpacity>
            )
          ) : (
            <Link href="/" setDrawerVisible={false}>
              <View style={styles.barIcon}>
                <MaterialIcons name="arrow-back" size={30} color="#008DD2" />
              </View>
            </Link>
          )}
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>
      <SafeAreaView>
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: drawerAnimation }] },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Image source={logo} style={[styles.logo]} resizeMode="contain" />
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileName}>{personName}</Text>
            <Text>{personEmail}</Text>
          </View>
          <Link href="/Subscription" setDrawerVisible={false}>
            <View style={styles.menuItem}>
              <MaterialIcons name="diamond" size={24} color="black" />
              <Text style={styles.menuItemText}>Get Premium</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </View>
          </Link>
          <Link href="/SubscriptionTest" setDrawerVisible={false}>
            <View style={styles.menuItem}>
              <MaterialIcons name="diamond" size={24} color="black" />
              <Text style={styles.menuItemText}>Get SubscriptionTest</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </View>
          </Link>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="mail-outline" size={24} color="#000" />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="share" size={24} color="#000" />
            <Text style={styles.menuItemText}>Share App</Text>
          </TouchableOpacity>

          {isLoggedIn ? (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#000" />
              <Text style={styles.menuItemText}>Log out</Text>
            </TouchableOpacity>
          ) : (
            <Link href="/Login">
              <View style={styles.menuItem}>
                <MaterialIcons name="login" size={24} color="#000" />
                <Text style={styles.menuItemText}>Log in</Text>
              </View>
            </Link>
          )}
        </Animated.View>
      </SafeAreaView>

      {drawerVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { zIndex: 2 },
  header: {
    // height: "10%",
    maxHeight: 102,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    // marginBottom:100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 29,
    elevation: 29,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    // zIndex: -1,
  },
  logo: {
    width: "56%",
    height: 102,
    marginHorizontal: "auto",
  },
  drawer: {
    position: "absolute",
    top: -102,
    left: 0,
    width: width * 0.74,
    height: height * 2,
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 0,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxHeight: 42,
    marginTop: 40,
  },
  profileSection: {
    marginVertical: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: "75%",
    right: 0,
    bottom: 0,
    height: height * 2,
    backgroundColor: "rgba(0, 0, 0, 0)",
    // zIndex: 1
  },
});

export default Header;
