import { FlashList } from "@shopify/flash-list";
import { VideoSource } from "expo-video";
import { useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import ListItem from "@/components/ListItem";

export type ViewSize = {
  width: number;
  height: number;
};

type Props = {
  videoSources: VideoSource[];
  onRefresh: () => void;
  refreshing: boolean;
};

export default function List({ videoSources, onRefresh, refreshing }: Props) {
  const [viewSize, setViewSize] = useState<ViewSize | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <View
      style={styles.contentContainer}
      onLayout={(e) => {
        setViewSize(e.nativeEvent.layout);
      }}
    >
      {viewSize && (
        <FlashList
          data={videoSources}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
              progressViewOffset={50}
            />
          }
          snapToInterval={viewSize.height}
          snapToAlignment="center"
          disableIntervalMomentum
          onViewableItemsChanged={({ viewableItems, changed }) => {
            const visible = viewableItems[0];
            const index = visible?.index;
            if (index != null) {
              setVisibleIndex(index);
            }
          }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            waitForInteraction: false,
          }}
          renderItem={({ item, index, extraData }) => (
            <ListItem
              item={item}
              index={index}
              viewSize={viewSize}
              visibleIndex={extraData}
            />
          )}
          extraData={visibleIndex}
          decelerationRate={0.8}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={viewSize.height}
          drawDistance={viewSize.height * 2}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "black",
  },
});
