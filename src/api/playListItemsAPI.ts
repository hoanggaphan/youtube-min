export function fetchListById(playlistId: string) {
  return gapi.client.youtube.playlistItems.list({
    part: ['snippet,contentDetails'],
    maxResults: 30,
    playlistId,
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
