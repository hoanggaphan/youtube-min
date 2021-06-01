import * as channelAPI from 'api/channelAPI';
import useSWR from 'swr';

const fetchChannel = async (url: string, channelId: string) => {
  try {
    const res = await channelAPI.fetchChannelById(channelId);
    return res.result.items![0];
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching channel';
    throw err.result.error;
  }
};

function useChannel(channelId: string | undefined) {
  const { data, error, isValidating } = useSWR(
    channelId ? ['api/channel/list', channelId] : null,
    fetchChannel
  );

  return {
    channel: data,
    error: error,
    isLoading: isValidating,
  };
}

export default useChannel;
