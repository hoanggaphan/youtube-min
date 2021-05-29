export function fetchList(pageToken?: string, maxResults: number = 25) {
  return gapi.client.youtube.subscriptions.list({
    part: ['snippet, contentDetails'],
    maxResults, // max 0 - 50, default is 25
    order: 'alphabetical',
    mine: true,
    pageToken,
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
