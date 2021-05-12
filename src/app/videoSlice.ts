import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as videoAPI from 'api/videoAPI';
import { RootState } from 'app/store';

interface ChannelState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  player: null | string;
  snippet: {
    publishedAt: null | string;
    title: null | string;
    channelId: null | string;
    description: null | string;
    liveBroadcastContent: null | 'live' | 'none' | 'upcoming';
  };
  statistics: {
    viewCount: null | string;
    likeCount: null | string;
    dislikeCount: null | string;
    commentCount: null | string;
  };
  liveStreamingDetails: {
    actualStartTime: null | string;
    scheduledStartTime: null | string;
    concurrentViewers: null | string;
    activeLiveChatId: null | string;
  };
}

const initialState: ChannelState = {
  loading: 'idle',
  player: null,
  snippet: {
    publishedAt: null,
    title: null,
    channelId: null,
    description: null,
    liveBroadcastContent: null,
  },
  statistics: {
    viewCount: null,
    likeCount: null,
    dislikeCount: null,
    commentCount: null,
  },
  liveStreamingDetails: {
    actualStartTime: null,
    scheduledStartTime: null,
    concurrentViewers: null,
    activeLiveChatId: null,
  },
};

export const fetchVideoById = createAsyncThunk(
  'channel/fetchVideoById',
  async (id: string, thunkAPI) => {
    const response = await videoAPI.fetchVideoById(id);

    if (response.status !== 200) {
      return thunkAPI.rejectWithValue(response.result);
    }

    return response.result;
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVideoById.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchVideoById.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchVideoById.fulfilled, (state, action) => {
      if (!action.payload.items.length) {
        state.loading = 'failed';
        return;
      }

      state.loading = 'succeeded';
      state.snippet = action.payload.items[0].snippet;
      state.statistics = action.payload.items[0].statistics;
      state.liveStreamingDetails = action.payload.items[0].liveStreamingDetails;
    });
  },
});

export const selectLoading = (state: RootState) => state.video.loading;
export const selectVideoTitle = (state: RootState) => state.video.snippet.title;
export const selectLiveBroadcastContent = (state: RootState) =>
  state.video.snippet.liveBroadcastContent;

export const selectVideoDescription = (state: RootState) =>
  state.video.snippet.description;
export const selectChannelId = (state: RootState) =>
  state.video.snippet.channelId;
export const selectVideoPublishAt = (state: RootState) =>
  state.video.snippet.publishedAt;

export const selectVideoViewCount = (state: RootState) =>
  state.video.statistics.viewCount;
export const selectVideoLikeCount = (state: RootState) =>
  state.video.statistics.likeCount;
export const selectVideoDislikeCount = (state: RootState) =>
  state.video.statistics.dislikeCount;
export const selectVideoCommentCount = (state: RootState) =>
  state.video.statistics.commentCount;

export const selectLiveStreaming = (state: RootState) =>
  state.video.liveStreamingDetails;

export default videoSlice.reducer;
