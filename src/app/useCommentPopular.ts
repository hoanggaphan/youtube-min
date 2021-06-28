import * as commentAPI from 'api/commentAPI';
import { useSWRInfinite } from 'swr';

const fetchComments = async (
  url: string,
  videoId: string,
  nextPageToken?: string
) => {
  try {
    const res = await commentAPI.fetchListByVideoId(videoId, nextPageToken);
    return res.result;
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching comment';
    throw err.result.error;
  }
};

function useCommentPopular(videoId: string | undefined) {
  const { data, error, setSize, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPageToken) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return [`/api/comment-popular`, videoId];

      // add the cursor to the API endpoint
      return [`/api/comment-popular`, videoId, previousPageData?.nextPageToken];
    },
    fetchComments
  );

  return {
    data,
    setSize,
    error,
    mutate,
  };
}

export type commentPState = ReturnType<typeof useCommentPopular>;

export default useCommentPopular;
