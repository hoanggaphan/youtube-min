import * as commentAPI from 'api/commentAPI';
import { useSWRInfinite } from 'swr';

const fetchComments = async (
  url: string,
  videoId: string,
  order: string,
  nextPageToken?: string
) => {
  try {
    const resComments = await commentAPI.fetchListByVideoId(
      videoId,
      nextPageToken,
      50,
      order
    );
    return resComments.result;
  } catch (err) {
    const result = (err as any).result.error;

    if (result.code === 403 && result.errors[0].reason === 'commentsDisabled') {
      const error = new Error('Tính năng bình luận đã bị tắt.');
      (error as any).info = result;
      throw error;
    }

    throw new Error('An error occurred while fetching comments');
  }
};

function useComments(videoId: string, order: string) {
  const { data, error, isValidating, setSize, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPageToken) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0)
        return videoId ? [`/api/comments?vid=`, videoId, order] : null;

      // add the cursor to the API endpoint
      return videoId
        ? [
            `/api/comments?vid=`,
            videoId,
            order,
            previousPageData?.nextPageToken,
          ]
        : null;
    },
    fetchComments
  );

  return {
    data,
    error,
    isLoading: isValidating,
    setSize,
    mutate,
  };
}

export type playlistItemsState = ReturnType<typeof useComments>;

export default useComments;
