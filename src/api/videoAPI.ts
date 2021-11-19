export function fetchVideoById(id: string) {
  return gapi.client.youtube.videos.list({
    part: ['snippet, contentDetails, statistics', 'liveStreamingDetails'],
    id,
  });
}

export function fetchPopularVideos(
  maxResults: number = 8,
  videoCategoryId?: string
) {
  return gapi.client.youtube.videos.list({
    part: ['snippet, contentDetails, statistics'],
    chart: 'mostPopular',
    maxResults,
    regionCode: 'VN',
    videoCategoryId,
  });
}

export function fetchMyRatingVideos(
  myRating: string = 'like',
  maxResults: number = 4,
  pageToken?: string
) {
  return gapi.client.youtube.videos.list({
    part: ['snippet, contentDetails, statistics'],
    myRating,
    maxResults,
    pageToken,
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
