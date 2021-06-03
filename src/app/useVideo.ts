import * as videoAPI from 'api/videoAPI';
import useSWR from 'swr';

const fetchVideo = async (url: string, videoId: string) => {
  try {
    const res = await videoAPI.fetchVideoById(videoId);
    if (res.result.items) {
      return res.result.items[0];
    }
  } catch (err) {
    // All errors will be handled at component
    err.result.error.message = 'An error occurred while fetching video';
    throw err.result.error;
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

export type videoState = ReturnType<typeof useVideo>;

export default useVideo;
