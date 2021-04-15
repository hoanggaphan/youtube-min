export async function fetchList() {
  try {
    const response = await gapi.client.youtube.subscriptions.list({
      part: ['snippet, contentDetails'],
      maxResults: 20, // max 0 - 50, default is 5
      order: 'alphabetical',
      mine: true,
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function fetchNextList(nextPageToken: string | undefined) {
  try {
    const response = await gapi.client.youtube.subscriptions.list({
      part: ['snippet, contentDetails'],
      maxResults: 20, // max 0 - 50, default is 5
      mine: true,
      order: 'alphabetical',
      pageToken: nextPageToken,
    });
    return response;
  } catch (error) {
    return error;
  }
}
