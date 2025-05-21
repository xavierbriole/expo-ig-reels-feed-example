import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import List from "@/components/List";
import useVideosData from "@/hooks/useVideosData";

export default function HomeScreen() {
  const { videoSources, refreshing, fetchData, onRefresh } = useVideosData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
