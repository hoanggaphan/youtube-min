import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as channelAPI from 'api/channelAPI';
import { RootState } from 'app/store';

interface ChannelState {
  data: null | gapi.client.youtube.Channel;
}

const initialState: ChannelState = {
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
      state.data = payload.items![0];
    });
  },
});

export const { resetChannel } = channelSlice.actions;

export const selectData = (state: RootState) => state.channel.data;

export const selectChannelId = (state: RootState) => state.channel.data?.id;
export const selectPlayListId = (state: RootState) =>
  state.channel.data?.contentDetails?.relatedPlaylists?.uploads;

export const selectChannelTitle = (state: RootState) =>
  state.channel.data?.snippet?.title;
export const selectChannelDes = (state: RootState) =>
  state.channel.data?.snippet?.description;
export const selectChannelCountry = (state: RootState) =>
  state.channel.data?.snippet?.country;
export const selectChannelPublishAt = (state: RootState) =>
  state.channel.data?.snippet?.publishedAt;
export const selectChannelThumbUrl = (state: RootState) =>
  state.channel.data?.snippet?.thumbnails?.default?.url;

export const selectChannelViewCount = (state: RootState) =>
  state.channel.data?.statistics?.viewCount;
export const selectChannelSubscriberCount = (state: RootState) =>
  state.channel.data?.statistics?.subscriberCount;

export const selectChannelBannerExternalUrl = (state: RootState) =>
  state.channel.data?.brandingSettings?.image?.bannerExternalUrl;

export default channelSlice.reducer;
