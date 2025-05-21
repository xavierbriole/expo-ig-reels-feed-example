import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Button,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ViewSize } from "@/components/List";

type Props = {
  item: VideoSource;
  index: number;
  viewSize: ViewSize;
  visibleIndex: number;
};

export default function ListItem({
  item,
  index,
  viewSize,
  visibleIndex,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // We don't pass the item directly into the player, when the item changes in the argument
  // the video player is re-created, which is slow
  const player = useVideoPlayer(null, (player) => {
    player.bufferOptions = {
      preferredForwardBufferDuration: 5,
    };
    player.loop = true;
    player.pause();
  });

  // Instead, we use the replace function
  useEffect(() => {
    (async () => {
      await player.replaceAsync(item);
      player.currentTime = 10;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "readyToPlay") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  });

  useEffect(() => {
    if (visibleIndex === index) {
      player.play();
    } else {
      player.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIndex]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && visibleIndex === index) {
        player.play();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        player.pause();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIndex]);

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePlayPause}>
      <View style={viewSize}>
        <VideoView
          player={player}
          style={styles.videoView}
          nativeControls={false}
          contentFit="cover"
          allowsVideoFrameAnalysis={false}
        />
        <ActivityIndicator
          style={styles.activityIndicator}
          animating={isLoading}
          size="large"
          color="#ffffff"
        />
        <View style={styles.overlayContainer}>
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
            style={[styles.gradient, { top: 0 }]}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
            style={[styles.gradient, { bottom: 0 }]}
          />
          <View style={styles.metadataContainer}>
            <Text style={styles.metadataTextTitle}>
              {(typeof item === "object" && item?.metadata?.title) ?? ""}
            </Text>
            <Text style={styles.metadataTextArtist}>
              {(typeof item === "object" && item?.metadata?.artist) ?? ""}
            </Text>
          </View>
          <View style={styles.controlsContainer}>
            <Button title="🤍" />
            <Button title="💬" />
            <Button title="🔗" />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  videoView: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    width: 100,
    height: 100,
  },
  overlayContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 300,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginRight: 10,
  },
  metadataTextTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 32,
  },
  metadataTextArtist: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
  },
  controlsContainer: {
    justifyContent: "space-around",
    height: 200,
    marginLeft: 10,
  },
});
