export async function fetchChannelById(id: string) {
  try {
    const response = await gapi.client.youtube.channels.list({
      part: ['snippet, contentDetails, statistics, brandingSettings'],
      id,
    });

    return response;
  } catch (error) {
    return error;
  }
}
