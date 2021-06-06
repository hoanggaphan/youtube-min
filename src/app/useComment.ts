import useSWR from 'swr';
import * as commentAPI from 'api/commentAPI';

const fetchComments = async (url: string, videoId: string) => {
  try {
    const res = await commentAPI.fetchListByVideoId(videoId);
    const data = res.result.items!;
    return data;
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching comment';
    throw err.result.error;
  }
};

function useComment(videoId: string | undefined, load?: boolean) {
  const { data, error, isValidating, mutate } = useSWR(
    videoId && load ? ['api/comment/list', videoId] : null,
    fetchComments
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export type commentState = ReturnType<typeof useComment>;

export default useComment;
