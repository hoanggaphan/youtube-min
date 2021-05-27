import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as channelAPI from 'api/channelAPI';
import { RootState } from 'app/store';

interface ChannelState {
  isFetching: 'pending' | 'succeed' | 'failed';
  data: null | gapi.client.youtube.Channel;
}

const initialState: ChannelState = {
  isFetching: 'pending',
  data: null,
};

export const fetchChannelById = createAsyncThunk(
  'channel/fetchChannelById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await channelAPI.fetchChannelById(id);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while fetching channel';
      return rejectWithValue(error.result.error);
    }
  }
);

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    resetChannel: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannelById.fulfilled, (state, { payload }) => {
      state.isFetching = 'succeed';
      state.data = payload.items![0];
    });
  },
});

export const { resetChannel } = channelSlice.actions;

export const selectChannelIsFetching = (state: RootState) =>
  state.channel.isFetching;
export const selectChannel = (state: RootState) => state.channel.data;

export default channelSlice.reducer;
