import useSWR from 'swr';
import * as subscriptionAPI from 'api/subscriptionAPI';
import { useAuth } from 'hooks/useAuth';

const fetchSubscription = async (url: string) => {
  try {
    const res = await subscriptionAPI.fetchList();
    return res.result;
  } catch (err) {
    throw new Error('An error occurred while fetching subscription');
  }
};

function useSubscription() {
  const { user } = useAuth();
  const { data, error, isValidating, mutate } = useSWR(
    user ? '/api/subscription?uid=' + user.id : null,
    fetchSubscription
  );

  return {
    data,
    error,
    isLoading: isValidating,
    mutate,
  };
}

export type subscriptionState = ReturnType<typeof useSubscription>;

export default useSubscription;
