import { getCurrentVideoCacheSize } from "expo-video";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import List from "@/components/List";
import useVideosData from "@/hooks/useVideosData";

export default function HomeScreen() {
  const { videoSources, refreshing, fetchData, onRefresh } = useVideosData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cacheSize = getCurrentVideoCacheSize();
      console.log(
        `Current cache size: ${Math.round(cacheSize / 1_000_0) / 100}MB`,
      );
    }, 2000);

    return () => clearInterval(interval);
  });

  return (
    <View style={styles.container}>
      <List
        videoSources={videoSources ?? []}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
