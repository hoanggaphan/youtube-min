export function fetchByKeyword(
  q: string,
  nextPageToken?: string,
  order: string = 'searchSortUnspecified'
) {
  return gapi.client.youtube.search.list({
    part: ['snippet'],
    maxResults: 50,
    pageToken: nextPageToken,
    order,
    q,
    type: ['video'],
  });
}
