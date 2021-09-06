import * as playlistItemsAPI from 'api/playListItemsAPI';
import * as videoAPI from 'api/videoAPI';
import { useSWRInfinite } from 'swr';

const fetchPlaylistItems = async (
  url: string,
  playlistId: string,
  nextPageToken?: string
) => {
  try {
    // fetch videos list
    const resPlaylistItems = await playlistItemsAPI.fetchListById(
      playlistId,
      nextPageToken
    );

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

      if (index !== -1) {
        pItem.snippet.viewCount = videosItems[index].statistics?.viewCount;
        pItem.snippet.duration = videosItems[index].contentDetails?.duration;
      }

      return pItem;
    });

    return resPlaylistItems.result;
  } catch (err) {
    const result = (err as any).result.error;
    
    if (result.code === 404 && result.errors[0].reason === 'playlistNotFound') {
      throw new Error('Kênh này không có video nào.');
    }

    throw new Error('An error occurred while fetching playlistItems');
    // err.result.error.message = 'An error occurred while fetching playlistItems';
    // throw err.result.error;
  }
};

function usePlaylistItems(playlistId: string | undefined) {
  const { data, error, isValidating, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPageToken) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0)
        return playlistId ? [`/api/playlist?pid=`, playlistId] : null;

      // add the cursor to the API endpoint
      return playlistId
        ? [`/api/playlist?pid=`, playlistId, previousPageData?.nextPageToken]
        : null;
    },
    fetchPlaylistItems
  );

  return {
    data,
    error,
    isLoading: isValidating,
    setSize,
  };
}

export type playlistItemsState = ReturnType<typeof usePlaylistItems>;

export default usePlaylistItems;
