import React, { useEffect, useState, useRef } from "react";
import { View, Image, Dimensions, FlatList, StyleSheet } from "react-native";

let displayDuration; // 25 seconds
const { width: screenWidth } = Dimensions.get("window");

const Ads = () => {
  const [ads, setAds] = useState([]);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to check if the ad is active based on start and end date
  const isAdActive = (ad) => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    return now >= start && now <= end;
  };

  const fetchAds = async () => {
    try {
      const response = await fetch("https://cd-backend-1.onrender.com/api/ads");
      const data = await response.json();
      displayDuration = data.displayDuration;
      const activeAds = data.ads.filter(isAdActive);
      setAds(activeAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  fetchAds();

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;

      if (nextIndex >= ads.length) {
        // Reset to the start immediately without animation to avoid the bounce-back effect
        carouselRef.current?.scrollToOffset({ offset: 0, animated: false });
        setCurrentIndex(0);
      } else {
        // Scroll to the next index with animation
        carouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 1
        });
        setCurrentIndex(nextIndex);
      }
    }, displayDuration);

    return () => clearInterval(interval);
  }, [currentIndex, ads.length]);
  // Render each ad item
  const renderItem = ({ item }) => (
    <View style={styles.adContainer}>
      <Image source={{ uri: item.contentUrl }} style={styles.adImage} />
    </View>
  );

  return (
    <FlatList
      ref={carouselRef}
      data={ads}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.carousel}
      onScrollToIndexFailed={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1
  },
  adContainer: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 12
  },
  adImage: {
    width: "100%",
    height: 100, // Adjust this as needed
    resizeMode: "cover"
  }
});

export default Ads;
