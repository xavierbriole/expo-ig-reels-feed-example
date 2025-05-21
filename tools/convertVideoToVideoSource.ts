import { VideoSource } from "expo-video";

import { Video } from "@/tools/fetchVideos";

export default function convertVideoToVideoSource(video: Video): VideoSource {
  return {
    uri: video.url,
    useCaching: true,
    metadata: {
      title: video.name,
      artist: video.description,
    },
  };
}
