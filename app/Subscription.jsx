import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
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
const Subscription = () => {
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
                  <Text style={[styles.text]}>Number of people - 10</Text>
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
                  <Text style={styles.packageText}>Standard Version</Text>
                </View>
              </LinearGradient>
              <Text style={styles.versionName}>Rs 5,000/-</Text>
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
                    Number of companies - 05
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
                    Number of people - 50
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
                  <Link href="/Login">
                    <Text style={styles.buttonText}>Get Standard</Text>
                  </Link>
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
                  <Text style={styles.packageText}>Premium Version</Text>
                </View>
              </LinearGradient>
              <Text style={[styles.versionName, styles.versionName3]}>
                Rs 10,000/-
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
                    Number of companies - 50
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
                    Number of people - 200
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
                  <Link href="/Login">
                    <Text style={styles.buttonText}>Get Premium</Text>
                  </Link>
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
  card3: { backgroundColor: "#002E62" },
  text3: { color: "white" },
  versionName3: {
    color: "white",
    borderColor: "white",
  },
});
