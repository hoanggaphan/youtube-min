import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as channelAPI from 'api/channelAPI';
import { RootState } from 'app/store';

interface ChannelState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  id: null | string;
  snippet: {
    title: null | string;
    thumbnails: {
      default: {
        url: undefined | string;
      };
    };
    publishedAt: null | string;
    country: null | string;
    description: null | string;
  };
  statistics: {
    subscriberCount: null | string;
    viewCount: null | string;
  };
  contentDetails: {
    relatedPlaylists: {
      uploads: null | string;
    };
  };
  brandingSettings: {
    image: {
      bannerExternalUrl: null | string;
    };
  };
}

const initialState: ChannelState = {
  loading: 'idle',
  id: null,
  snippet: {
    title: null,
    thumbnails: {
      default: {
        url: undefined,
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
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchChannelById.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      const {
        id,
        snippet,
        statistics,
        contentDetails,
        brandingSettings,
      } = action.payload.items[0];
      state.id = id;
      state.snippet = snippet;
      state.statistics = statistics;
      state.contentDetails = contentDetails;
      state.brandingSettings = brandingSettings;
    });
  },
});

export const { resetChannel } = channelSlice.actions;

export const selectLoading = (state: RootState) => state.channel.loading;

export const selectChannelId = (state: RootState) => state.channel.id;
export const selectPlayListId = (state: RootState) =>
  state.channel.contentDetails.relatedPlaylists.uploads;

export const selectChannelTitle = (state: RootState) =>
  state.channel.snippet.title;
export const selectChannelDes = (state: RootState) =>
  state.channel.snippet.description;
export const selectChannelCountry = (state: RootState) =>
  state.channel.snippet.country;
export const selectChannelPublishAt = (state: RootState) =>
  state.channel.snippet.publishedAt;
export const selectChannelThumbUrl = (state: RootState) =>
  state.channel.snippet.thumbnails.default.url;

export const selectChannelViewCount = (state: RootState) =>
  state.channel.statistics.viewCount;
export const selectChannelSubscriberCount = (state: RootState) =>
  state.channel.statistics.subscriberCount;

export const selectChannelBannerExternalUrl = (state: RootState) =>
  state.channel.brandingSettings.image?.bannerExternalUrl;

export default channelSlice.reducer;
