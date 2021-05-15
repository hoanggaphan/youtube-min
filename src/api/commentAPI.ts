export async function fetchListByVideoId(videoId: string) {
  try {
    const response = await gapi.client.youtube.commentThreads.list({
      part: ['snippet,replies'],
      textFormat: 'plainText',
      videoId,
    });
    return response;
  } catch (error) {
    return error;
  }
}
