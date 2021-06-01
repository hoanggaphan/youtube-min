import useSWR from 'swr';
import * as subscriptionAPI from 'api/subscriptionAPI';

const fetchSubscription = async (url: string) => {
  try {
    const response = await subscriptionAPI.fetchList();
    return response.result;
  } catch (error) {
    error.result.error.message =
      'An error occurred while fetching subscription';
    throw error.result.error;
  }
};

function useSubscription() {
  const { data, error, isValidating, mutate } = useSWR(
    'api/subscription/list',
    fetchSubscription
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export default useSubscription;
