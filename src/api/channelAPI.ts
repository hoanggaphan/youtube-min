export function fetchChannelById(id: string) {
  return gapi.client.youtube.channels.list({
    part: ['snippet, contentDetails, statistics, brandingSettings'],
    id,
  });
}
