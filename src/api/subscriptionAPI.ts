export function fetchList() {
  return gapi.client.youtube.subscriptions.list({
    part: ['snippet, contentDetails'],
    maxResults: 25, // max 0 - 50, default is 5
    order: 'alphabetical',
    mine: true,
  });
}

export function fetchNextList(nextPageToken: string | undefined) {
  return gapi.client.youtube.subscriptions.list({
    part: ['snippet, contentDetails'],
    maxResults: 25, // max 0 - 50, default is 5
    mine: true,
    order: 'alphabetical',
    pageToken: nextPageToken,
  });
}

export function checkSubExist(channelId: string) {
  return gapi.client.youtube.subscriptions.list({
    part: ['snippet,contentDetails'],
    forChannelId: channelId,
    mine: true,
  });
}

export function deleteSub(id: string) {
  return gapi.client.youtube.subscriptions.delete({
    id,
  });
}

export function addSub(channelId: string) {
  return gapi.client.youtube.subscriptions.insert({
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
}
