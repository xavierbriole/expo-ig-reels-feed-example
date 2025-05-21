import { VideoSource } from "expo-video";
import { useCallback, useState } from "react";

import convertVideoToVideoSource from "@/tools/convertVideoToVideoSource";
import fetchVideos from "@/tools/fetchVideos";

interface IVideosData {
  videoSources: VideoSource[] | undefined;
  refreshing: boolean;
  fetchData: () => Promise<void>;
  onRefresh: () => void;
}

export default function useVideosData(): IVideosData {
  const [videoSources, setVideoSources] = useState<VideoSource[] | undefined>(
    undefined,
  );
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setRefreshing(true);

    const videos = await fetchVideos({
      hostUrl: "http://localhost:3000",
    });
    const videoSources = videos.map((video) =>
      convertVideoToVideoSource(video),
    );
    setVideoSources(videoSources);

    setRefreshing(false);
  }, []);

  const onRefresh = useCallback(() => {
    setVideoSources(undefined);
    fetchData();
  }, [fetchData]);

  return {
    videoSources,
    refreshing,
    fetchData,
    onRefresh,
  };
}
