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

export function fetchVideosViews(ids: string[]) {
  return gapi.client.youtube.videos.list({
    part: ['contentDetails', 'statistics'],
    id: ids,
  });
}
