export function fetchListByVideoId(videoId: string) {
  return gapi.client.youtube.commentThreads.list({
    part: ['snippet,replies'],
    textFormat: 'plainText',
    videoId,
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
