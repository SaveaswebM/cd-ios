import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as RNIap from "react-native-iap";
const InAppPurchases = () => {
  const [products, setProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  useEffect(() => {
    const initIAP = async () => {
      try {
        const productIds = ["premium_01"]; // Replace with your actual product IDs
        await RNIap.initConnection();
        const products = await RNIap.getProducts(productIds);
        setProducts(products);
      } catch (error) {
        console.error("Error preparing IAP:", error);
      }
    };

    initIAP();
  }, []);

  const handlePurchase = async (productId) => {
    try {
      const purchase = await RNIap.requestPurchase(productId);
      const receipt = await RNIap.consumeProduct(
        purchase.transactionIdentifier
      );
      setPurchasedProducts([...purchasedProducts, receipt]);
      console.log("Purchase successful:", receipt);
    } catch (error) {
      console.error("Error purchasing:", error);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const purchases = await RNIap.restorePurchases();
      setPurchasedProducts(purchases);
      console.log("Purchases restored:", purchases);
    } catch (error) {
      console.error("Error restoring purchases:", error);
    }
  };

  return (
    <View>
      {products.map((product) => (
        <Button
          key={product.productId}
          title={`Purchase ${product.localizedPrice}`}
          onPress={() => handlePurchase(product.productId)}
        />
      ))}
      <Button title="Restore Purchases" onPress={handleRestorePurchases} />
      <Text>Purchased Products:</Text>
      {purchasedProducts.map((product) => (
        <Text key={product.transactionIdentifier}>{product.productId}</Text>
      ))}
    </View>
  );
};

export default InAppPurchases;
