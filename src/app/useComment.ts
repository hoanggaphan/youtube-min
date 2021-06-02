import useSWR from 'swr';
import * as commentAPI from 'api/commentAPI';

const fetchComments = async (url: string, videoId: string) => {
  try {
    const res = await commentAPI.fetchListByVideoId(videoId);
    const data = res.result.items!;
    return data;
  } catch (error) {
    error.result.error.message = 'An error occurred while fetching comment';
    throw error.result.error;
  }
};

function useComment(videoId: string | undefined) {
  const { data, error, isValidating, mutate } = useSWR(
    videoId ? ['api/comment/list', videoId] : null,
    fetchComments
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export default useComment;
