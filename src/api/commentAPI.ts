export function fetchListByVideoId(
  videoId: string,
  pageToken?: string,
  maxResults: number = 50,
  order: string = 'relevance'
) {
  return gapi.client.youtube.commentThreads.list({
    part: ['snippet,replies'],
    textFormat: 'plainText',
    videoId,
    maxResults,
    order,
    pageToken,
  });
}

export function insertByVideoId(videoId: string, text: string) {
  return gapi.client.youtube.commentThreads.insert({
    part: ['snippet'],
    resource: {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: text,
          },
        },
      },
    },
  });
}

export function fetchRepliesById(
  parentId: string,
  pageToken?: string,
  maxResults: number = 50
) {
  return gapi.client.youtube.comments.list({
    part: ['snippet'],
    pageToken,
    maxResults,
    parentId,
  });
}
