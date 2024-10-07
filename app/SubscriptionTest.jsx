import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

import Purchases, { PurchasesOffering } from "react-native-purchases";

const APIKeys = {
  apple: "appl_fzvjktRltxPHoqGGOgVXAzxlqRC",
  google: "goog_criSyFSujMyvjeGPtutrNHniHKd",
};

export default function App() {
  const [currentOffering, setCurrentOffering] = useState(null);

  useEffect(() => {
    const setup = async () => {
      if (Platform.OS == "android") {
        const cc = await Purchases.configure({ apiKey: APIKeys.google });
      } else {
        await Purchases.configure({ apiKey: APIKeys.apple });
      }
      // Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      // const offerings = await Purchases.getOfferings();
      // console.log("ogg", offerings);
      // setCurrentOffering(offerings.current);
      await loadOfferings();
    };

    // Purchases.setDebugLogsEnabled(true);

    setup();
  }, []);
  const loadOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    console.log("workinnnnnnnnnnnnnnnnnnnnnnnng", offerings);

    if (offerings.current) {
      console.log("pakgs", offerings.current.availablePackages);
    } else {
      console.log("pkgs not found .");
    }
  };
  if (!currentOffering) {
    // return  "Loading...";
  } else {
    return (
      <View>
        <Text>Current Offering: {currentOffering.identifier}</Text>
        <Text>Package Count: {currentOffering.availablePackages.length}</Text>
        {currentOffering.availablePackages.map((pkg) => {
          return <Text>{pkg.product.identifier}</Text>;
        })}
      </View>
    );
  }
}
