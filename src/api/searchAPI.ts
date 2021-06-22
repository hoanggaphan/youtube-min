export function fetchByKeyword(
  q: string,
  order: string = 'searchSortUnspecified'
) {
  return gapi.client.youtube.search.list({
    part: ['snippet'],
    maxResults: 20,
    order,
    q,
    type: ['video'],
  });
}
