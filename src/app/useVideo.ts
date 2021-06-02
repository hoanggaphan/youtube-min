import * as videoAPI from 'api/videoAPI';
import useSWR from 'swr';

const fetchVideo = async (url: string, videoId: string) => {
  try {
    const response = await videoAPI.fetchVideoById(videoId);
    return response.result.items![0];
  } catch (error) {
    // All errors will be handled at component
    error.result.error.message = 'An error occurred while fetching video';
    throw error.result.error;
  }
};

function useVideo(videoId: string | undefined) {
  const { data, error, isValidating, mutate } = useSWR(
    videoId ? [`/api/video/list`, videoId] : null,
    fetchVideo
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export default useVideo;
