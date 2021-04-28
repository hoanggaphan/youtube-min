export async function fetchListById(playlistId: string) {
  try {
    const response = await gapi.client.youtube.playlistItems.list({
      part: ['snippet,contentDetails'],
      maxResults: 30,
      playlistId,
    });

    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchNextListById(
  playlistId: string,
  nextPageToken: string | undefined
) {
  try {
    const response = await gapi.client.youtube.playlistItems.list({
      part: ['snippet,contentDetails'],
      maxResults: 30,
      playlistId,
      pageToken: nextPageToken,
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
