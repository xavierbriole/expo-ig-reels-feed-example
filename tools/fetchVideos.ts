type Params = {
  hostUrl: string;
};

export type Video = {
  name: string;
  description: string;
  url: string;
};

export default async function fetchVideos({
  hostUrl,
}: Params): Promise<Video[]> {
  try {
    const response = await fetch(`${hostUrl}/videos`);

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}
