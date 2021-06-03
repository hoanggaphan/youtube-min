import * as playlistItemsAPI from 'api/playListItemsAPI';
import * as videoAPI from 'api/videoAPI';
import useSWR from 'swr';

const fetchPlaylistItems = async (url: string, playlistId: string) => {
  try {
    // fetch videos list
    const resPlaylistItems = await playlistItemsAPI.fetchListById(playlistId);

    // ids for call api to get videos views
    const ids = resPlaylistItems.result.items?.map(
      (item: gapi.client.youtube.PlaylistItem) =>
        item.snippet?.resourceId?.videoId!
    )!;

    // fetch videos views
    const resVideos = await videoAPI.fetchVideosViews(ids);
    const videosItems = resVideos.result.items!;

    resPlaylistItems.result.items?.forEach((pItem: any) => {
      const index = videosItems.findIndex(
        (vItem: gapi.client.youtube.Video) =>
          vItem.id === pItem.snippet.resourceId.videoId
      );

      pItem.snippet.viewCount = videosItems[index].statistics?.viewCount;
      pItem.snippet.duration = videosItems[index].contentDetails?.duration;
      return pItem;
    });

    return resPlaylistItems.result;
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching playlistItems';
    throw err.result.error;
  }
};

function usePlaylistItems(playlistId: string | undefined) {
  const { data, error, isValidating, mutate } = useSWR(
    playlistId ? ['api/playlistItems/list', playlistId] : null,
    fetchPlaylistItems
  );

  return {
    data,
    error: error,
    isLoading: isValidating,
    mutate,
  };
}

export type playlistItemsState = ReturnType<typeof usePlaylistItems>;

export default usePlaylistItems;
