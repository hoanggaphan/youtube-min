import * as commentAPI from 'api/commentAPI';
import { useInfiniteQuery } from 'react-query';

const fetchComments = async (
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
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    [`/api/comments?vid=`, videoId, order],
    ({ pageParam }) => fetchComments(videoId, order, pageParam),
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPageToken,
    }
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
}

export type playlistItemsState = ReturnType<typeof useComments>;

export default useComments;
