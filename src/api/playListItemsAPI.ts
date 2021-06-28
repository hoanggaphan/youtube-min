export function fetchListById(
  playlistId: string,
  pageToken?: string,
  maxResults: number = 50
) {
  return gapi.client.youtube.playlistItems.list({
    part: ['snippet,contentDetails'],
    maxResults,
    playlistId,
    pageToken,
  });
}
