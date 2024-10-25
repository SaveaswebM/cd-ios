// SubscriptionTest2.js
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import {
  useIAP,
  requestPurchase,
  isIosStorekit2,
  PurchaseError,
} from "react-native-iap";

const SubscriptionTest2 = () => {
  const { products, currentPurchase, finishTransaction, getProducts } =
    useIAP();
  const [loading, setLoading] = useState(false);

  const productSkus = {
    ios: ["com.thirdeyetechlabs.compliancediary"],
    android: ["com.thirdeyetechlabs.compliancediary"],
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      setLoading(true);
      await getProducts({ skus: productSkus[Platform.OS] });
    } catch (error) {
      console.log({ message: "handleGetProducts", error });
      setLoading(false);
    }
  };

  const handleBuyProduct = async (sku) => {
    try {
      setLoading(true);
      await requestPurchase({ sku });
    } catch (error) {
      console.log("Error in purchase:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      if (
        (isIosStorekit2() && currentPurchase?.transactionId) ||
        currentPurchase?.transactionReceipt
      ) {
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: true,
        });
        console.log("Transaction successful:", currentPurchase);
        setLoading(false);
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        products.map((product, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleBuyProduct(product.productId)}
            style={{ marginVertical: 10 }}
          >
            <Text>
              {product.title} for <Text>{product.localizedPrice}</Text>
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default SubscriptionTest2;
