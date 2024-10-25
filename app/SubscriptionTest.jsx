import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
// import { WebView } from "react-native-webview";

const SubscriptionTest = () => {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Fetch the Razorpay order ID from your backend when the component mounts
    const fetchOrderId = async () => {
      try {
        const response = await fetch(
          "https://cd-backend-1.onrender.com/api/createOrder",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setOrderId(data.id); // Set the fetched order ID
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrderId();
  }, []);

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.success) {
      // Payment was successful
      alert("Payment successful!");
    } else {
      // Payment failed
      alert("Payment failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ flex: 1, justifyContent: "center" }}
        />
      )}
      {orderId && <WebView source={{ uri: "https://expo.dev" }} />} */}
    </View>
  );
};

export default SubscriptionTest;
