import * as channelAPI from 'api/channelAPI';
import useSWR from 'swr';

const fetcher = async (
  url: string,
  fetchVideos: () => gapi.client.Request<gapi.client.youtube.VideoListResponse>
) => {
  try {
    const resVideo = await fetchVideos();

    if (resVideo.result.items?.length === 0) {
      return resVideo.result;
    }

    // ids for call api to get channel avatar
    const ids = resVideo.result.items?.map(
      (item: gapi.client.youtube.Video) => item.snippet?.channelId!
    )!;

    const resChannel = await channelAPI.fetchChannelById(ids);
    const channelItems = resChannel.result.items!;
    resVideo.result.items?.forEach((vItem: any) => {
      const index = channelItems.findIndex(
        (cItem: gapi.client.youtube.Channel) =>
          cItem.id === vItem.snippet.channelId
      );

      if (index !== -1) {
        vItem.snippet.channelAvatar =
          channelItems[index].snippet?.thumbnails?.default?.url;
      }

      return vItem;
    });

    return resVideo.result;
  } catch (err) {
    throw new Error('An error occurred while fetching videos');
  }
};

function useVideos(
  queryParams: string | null,
  fetchVideos: () => gapi.client.Request<gapi.client.youtube.VideoListResponse>
) {
  const { data, error, isValidating, mutate } = useSWR(
    queryParams ? [`/api/videos?${queryParams}`, fetchVideos] : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export type videosState = ReturnType<typeof useVideos>;

export default useVideos;
