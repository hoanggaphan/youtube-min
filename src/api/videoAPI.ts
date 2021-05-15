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

export async function getRating(id: string) {
  try {
    const response = await gapi.client.youtube.videos.getRating({
      id,
    });

    return response;
  } catch (error) {
    return error;
  }
}

export async function rating(id: string, type: string) {
  try {
    const response = await gapi.client.youtube.videos.rate({
      id,
      rating: type,
    });

    return response;
  } catch (error) {
    return error;
  }
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
