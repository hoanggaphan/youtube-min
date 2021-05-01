import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as subscriptionAPI from 'api/subscriptionAPI';
import { RootState } from 'app/store';

interface SubscriptionState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  nextPageToken: string | undefined;
  items: any;
  exist: any;
}

const initialState: SubscriptionState = {
  loading: 'idle',
  nextPageToken: undefined,
  items: [],
  exist: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchList',
  async (user, thunkApi) => {
    const response = await subscriptionAPI.fetchList();

    if (response.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(response.result);
    }

    return response.result;
  }
);

export const fetchNextSubscriptions = createAsyncThunk(
  'subscription/fetchNextList',
  async (nextPageToken: string | undefined, thunkApi) => {
    const response = await subscriptionAPI.fetchNextList(nextPageToken);

    if (response.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(response.result);
    }

    return response.result;
  }
);

export const checkSubscriptionExist = createAsyncThunk(
  'subscription/checkExist',
  async (channelId: string, thunkApi) => {
    const response = await subscriptionAPI.checkSubExist(channelId);

    if (response.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(response.result);
    }

    return response.result;
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscription/delete',
  async (id: string, thunkApi) => {
    const response = await subscriptionAPI.deleteSub(id);

    if (response.status !== 204) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(response.result);
    }

    return response.result;
  }
);

export const addSubscription = createAsyncThunk(
  'subscription/add',
  async (channelId: string, thunkApi) => {
    const response = await subscriptionAPI.addSub(channelId);

    if (response.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(response.result);
    }

    return response.result;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    resetSubscription: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptions.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchSubscriptions.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.items = action.payload.items;
      state.nextPageToken = action.payload.nextPageToken;
    });

    builder.addCase(fetchNextSubscriptions.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchNextSubscriptions.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchNextSubscriptions.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.items.push(...action.payload.items);
      state.nextPageToken = action.payload.nextPageToken;
    });

    builder.addCase(checkSubscriptionExist.rejected, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(checkSubscriptionExist.fulfilled, (state, action) => {
      state.exist = action.payload.items;
    });

    builder.addCase(deleteSubscription.rejected, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(deleteSubscription.fulfilled, (state, action) => {
      state.exist = [];
    });

    builder.addCase(addSubscription.rejected, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(addSubscription.fulfilled, (state, action) => {
      state.exist.push(action.payload);
    });
  },
});

export const { resetSubscription } = subscriptionSlice.actions;

export const selectLoading = (state: RootState) => state.subscription.loading;
export const selectSubscriptions = (state: RootState) =>
  state.subscription.items;
export const selectNextPageToken = (state: RootState) =>
  state.subscription.nextPageToken;
export const selectExist = (state: RootState) => state.subscription.exist;
export default subscriptionSlice.reducer;
