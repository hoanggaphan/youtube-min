import useSWR from 'swr';
import * as subscriptionAPI from 'api/subscriptionAPI';
import { useAuth } from 'hooks/useAuth';

const fetchSubscription = async (url: string) => {
  try {
    const res = await subscriptionAPI.fetchList();
    return res.result;
  } catch (err) {
    err.result.error.message = 'An error occurred while fetching subscription';
    throw err.result.error;
  }
};

function useSubscription() {
  const { user } = useAuth();
  console.log(user?.id);
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
