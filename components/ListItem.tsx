import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { VideoSource, VideoView, useVideoPlayer } from "expo-video";
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
  const [shouldPlay, setShouldPlay] = useState(visibleIndex === index);
  const [isLoading, setIsLoading] = useState(true);

  const player = useVideoPlayer(null, (player) => {
    player.bufferOptions = {
      preferredForwardBufferDuration: 5,
    };
    player.loop = true;
    player.pause();
  });

  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "readyToPlay") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  });

  useEffect(() => {
    (async () => {
      await player.replaceAsync(item);
      player.currentTime = 10;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    setShouldPlay(visibleIndex === index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIndex]);

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && visibleIndex === index) {
        setShouldPlay(true);
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        setShouldPlay(false);
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
    if (visibleIndex === index) {
      setShouldPlay((prev) => !prev);
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
