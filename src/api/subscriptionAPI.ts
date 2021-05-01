export async function fetchList() {
  try {
    const response = await gapi.client.youtube.subscriptions.list({
      part: ['snippet, contentDetails'],
      maxResults: 25, // max 0 - 50, default is 5
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
      maxResults: 25, // max 0 - 50, default is 5
      mine: true,
      order: 'alphabetical',
      pageToken: nextPageToken,
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function checkSubExist(channelId: string) {
  try {
    const response = await gapi.client.youtube.subscriptions.list({
      part: ['snippet,contentDetails'],
      forChannelId: channelId,
      mine: true,
    });

    return response;
  } catch (error) {
    return error;
  }
}

export async function deleteSub(id: string) {
  try {
    const response = await gapi.client.youtube.subscriptions.delete({
      id,
    });

    return response;
  } catch (error) {
    return error;
  }
}

export async function addSub(channelId: string) {
  try {
    const response = await gapi.client.youtube.subscriptions.insert({
      part: ['snippet'],
      resource: {
        snippet: {
          resourceId: {
            kind: 'youtube#channel',
            channelId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    return error;
  }
}
