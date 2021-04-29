import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as channelAPI from 'api/channelAPI';
import { RootState } from 'app/store';

interface ChannelState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  channel: any;
}

const initialState: ChannelState = {
  loading: 'idle',
  channel: {
    id: null,
    snippet: {
      title: null,
      thumbnails: {
        default: {
          url: null,
        },
      },
      publishedAt: null,
      country: null,
      description: null,
    },
    statistics: {
      subscriberCount: null,
      viewCount: null,
    },
    contentDetails: {
      relatedPlaylists: {
        uploads: null,
      },
    },
    brandingSettings: {
      image: {
        bannerExternalUrl: null,
      },
    },
  },
};

export const fetchChannelById = createAsyncThunk(
  'channel/fetchChannelById',
  async (id: string, thunkAPI) => {
    const response = await channelAPI.fetchChannelById(id);

    if (response.status !== 200) {
      return thunkAPI.rejectWithValue(response.result);
    }

    return response.result;
  }
);

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    resetChannel: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannelById.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchChannelById.rejected, (state, action) => {
      state.loading = 'idle';
      console.error(action.payload);
    });
    builder.addCase(fetchChannelById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.channel = action.payload.items[0];
    });
  },
});

export const { resetChannel } = channelSlice.actions;

export const selectChannel = (state: RootState) => state.channel.channel;
export const selectChannelId = (state: RootState) => state.channel.channel.id;
export const selectPlayListId = (state: RootState) =>
  state.channel.channel.contentDetails.relatedPlaylists.uploads;

export const selectChannelDes = (state: RootState) =>
  state.channel.channel.snippet.description;
export const selectChannelCountry = (state: RootState) =>
  state.channel.channel.snippet.country;
export const selectChannelPublishAt = (state: RootState) =>
  state.channel.channel.snippet.publishedAt;
export const selectChannelViewCount = (state: RootState) =>
  state.channel.channel.statistics.viewCount;

export default channelSlice.reducer;
