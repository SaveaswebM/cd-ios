import { StyleSheet, Text, View, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import * as IAP from "react-native-iap";
const items = Platform.select({
  ios: ["professional01"],
  android: ["premium-monthly"],
});

const SubscriptionIAP = () => {
  const [purchased, setPurchase] = useState(false);
  const [products, setProducts] = useState({});
  useEffect(() => {
    IAP.initConnection()
      .catch(() => {
        console.log("error connecting to store");
      })
      .then(() => {
        IAP.getSubscriptions(items)
          .catch(() => {
            console.log("error fetching items");
          })
          .then((res) => {
            console.log("got products");
            setProducts(res);
            console.log(res);
          });
      });
  }, []);
  return (
    <View>
      <Text>SubscriptionIAP</Text>
    </View>
  );
};

export default SubscriptionIAP;

const styles = StyleSheet.create({});
