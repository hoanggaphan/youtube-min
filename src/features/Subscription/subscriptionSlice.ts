import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import * as subscriptionAPI from './subscriptionAPI';

interface SubscriptionState {
  loading: 'idle' | 'loading' | 'failed';
  subscriptions: {
    items: any;
    nextPageToken?: string;
  };
}

const initialState: SubscriptionState = {
  loading: 'idle',
  subscriptions: {
    items: [],
    nextPageToken: undefined,
  },
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

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptions.pending, (state, action) => {
      state.loading = 'loading';
    });
    builder.addCase(fetchSubscriptions.rejected, (state, action) => {
      state.loading = 'idle';
      console.error(action.payload);
    });
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.subscriptions = action.payload;
    });

    builder.addCase(fetchNextSubscriptions.pending, (state, action) => {
      state.loading = 'loading';
    });
    builder.addCase(fetchNextSubscriptions.rejected, (state, action) => {
      state.loading = 'idle';
      console.error(action.payload);
    });
    builder.addCase(fetchNextSubscriptions.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.subscriptions.items.push(...action.payload.items);
      state.subscriptions.nextPageToken = action.payload.nextPageToken;
    });
  },
});

export const selectSubscriptions = (state: RootState) =>
  state.subscription.subscriptions.items;

export const selectNextPageToken = (state: RootState) =>
  state.subscription.subscriptions.nextPageToken;

export default subscriptionSlice.reducer;
