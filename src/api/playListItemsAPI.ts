export function fetchListById(
  playlistId: string,
  pageToken?: string,
  maxResults: number = 30
) {
  return gapi.client.youtube.playlistItems.list({
    part: ['snippet,contentDetails'],
    maxResults,
    playlistId,
    pageToken,
  });
}

export function fetchNextListById(
  playlistId: string,
  nextPageToken: string | undefined
) {
  return gapi.client.youtube.playlistItems.list({
    part: ['snippet,contentDetails'],
    maxResults: 30,
    playlistId,
    pageToken: nextPageToken,
  });
}
