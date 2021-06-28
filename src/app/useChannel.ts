import * as channelAPI from 'api/channelAPI';
import useSWR from 'swr';

const fetchChannel = async (url: string, channelId: string) => {
  try {
    const res = await channelAPI.fetchChannelById(channelId);
    if (res.result.items) {
      return res.result.items[0];
    }
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching channel';
    throw err.result.error;
  }
};

function useChannel(channelId: string | undefined) {
  const { data, error, isValidating, mutate } = useSWR(
    channelId ? ['/api/channel', channelId] : null,
    fetchChannel
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export type channelState = ReturnType<typeof useChannel>;

export default useChannel;
