export function fetchVideoById(id: string) {
  return gapi.client.youtube.videos.list({
    part: ['snippet, contentDetails, statistics', 'liveStreamingDetails'],
    id,
  });
}

export function getRating(id: string) {
  return gapi.client.youtube.videos.getRating({
    id,
  });
}

export function rating(id: string, type: string) {
  return gapi.client.youtube.videos.rate({
    id,
    rating: type,
  });
}

export async function fetchVideosViews(ids: string[]) {
  try {
    const response = await gapi.client.youtube.videos.list({
      part: ['contentDetails', 'statistics'],
      id: ids,
    });

    return response;
  } catch (error) {
    return error;
  }
}
