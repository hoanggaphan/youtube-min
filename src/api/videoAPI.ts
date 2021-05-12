export async function fetchVideoById(id: string) {
  try {
    const response = await gapi.client.youtube.videos.list({
      part: ['snippet, contentDetails, statistics', 'liveStreamingDetails'],
      id,
    });

    return response;
  } catch (error) {
    return error;
  }
}
