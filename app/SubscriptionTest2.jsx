import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as RNIap from "react-native-iap";

// Correct SKUs (double-check for typos)
const skus = ["com.thirdeyetechlabs.compliancediary.premium_01"];

const SubscriptionTest2 = () => {
  const [products, setProducts] = useState([]);
  const [purchaseInfo, setPurchaseInfo] = useState(null);

  // Initialize connection to the store
  useEffect(() => {
    async function init() {
      try {
        await RNIap.initConnection();
        console.log("Connection to store successful");
        await getProducts(); // Fetch products after connection
      } catch (err) {
        console.warn("Error initializing connection:", err);
      }
    }

    init();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  // Fetch available subscriptions/products
  const getProducts = async () => {
    try {
      const products = await RNIap.getSubscriptions(skus); // Pass skus array here
      setProducts(products);
      console.log("Products fetched:", products);
    } catch (err) {
      console.warn("Error fetching products:", err.message);
    }
  };

  // Purchase a subscription
  const purchaseSubscription = async (sku) => {
    try {
      const purchase = await RNIap.requestSubscription(sku);
      setPurchaseInfo(purchase);
      console.log("Purchase successful:", purchase);
      Alert.alert("Success", "Subscription purchased successfully");
    } catch (err) {
      console.warn("Error during purchase:", err.message);
      Alert.alert("Error", "Failed to purchase subscription");
    }
  };

  return (
    <View>
      <Text>Subscription Test</Text>
      {products.length > 0 ? (
        products.map((product, index) => (
          <View key={index}>
            <Text>{product.title}</Text>
            <Text>{product.description}</Text>
            <Text>Price: {product.localizedPrice}</Text>
            <Button
              title={`Subscribe to ${product.title}`}
              onPress={() => purchaseSubscription(product.productId)}
            />
          </View>
        ))
      ) : (
        <Text>No products available</Text>
      )}
    </View>
  );
};

export default SubscriptionTest2;
