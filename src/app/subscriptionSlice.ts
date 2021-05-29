import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as subscriptionAPI from 'api/subscriptionAPI';
import { RootState } from 'app/store';

interface SubscriptionState {
  nextPageToken: string | undefined;
  data: null | gapi.client.youtube.Subscription[];
  exist: any;
}

const initialState: SubscriptionState = {
  nextPageToken: undefined,
  data: null,
  exist: null,
};

export const checkSubscriptionExist = createAsyncThunk(
  'subscription/checkExist',
  async (channelId: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.checkSubExist(channelId);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message =
        'An error occurred while checking exist subscription';
      return rejectWithValue(error.result.error);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscription/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.deleteSub(id);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message =
        'An error occurred while deleting subscription';
      return rejectWithValue(error.result.error);
    }
  }
);

export const addSubscription = createAsyncThunk(
  'subscription/add',
  async (channelId: string, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.addSub(channelId);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message =
        'An error occurred while adding subscription';
      return rejectWithValue(error.result.error);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    resetSubscription: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(checkSubscriptionExist.fulfilled, (state, action) => {
      state.exist = action.payload.items;
    });

    builder.addCase(deleteSubscription.fulfilled, (state, action) => {
      state.exist = [];
    });

    builder.addCase(addSubscription.fulfilled, (state, action) => {
      state.exist.push(action.payload);
    });
  },
});

export const { resetSubscription } = subscriptionSlice.actions;

export const selectNextPageToken = (state: RootState) =>
  state.subscription.nextPageToken;
export const selectExist = (state: RootState) => state.subscription.exist;
export default subscriptionSlice.reducer;
