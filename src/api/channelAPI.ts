export function fetchChannelById(id: string | string[]) {
  return gapi.client.youtube.channels.list({
    part: ['snippet, contentDetails, statistics, brandingSettings'],
    id,
  });
}
