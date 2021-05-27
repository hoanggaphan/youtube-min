import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as videoAPI from 'api/videoAPI';
import { RootState } from 'app/store';

interface ChannelState {
  isFetching: 'pending' | 'succeed' | 'failed';
  data: null | gapi.client.youtube.Video;
  rating: null | gapi.client.youtube.VideoRating;
}

const initialState: ChannelState = {
  isFetching: 'pending',
  data: null,
  rating: null,
};

export const fetchVideoById = createAsyncThunk(
  'video/fetchVideoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await videoAPI.fetchVideoById(id);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while fetching video';
      return rejectWithValue(error.result.error);
    }
  }
);

export const getVideoRating = createAsyncThunk(
  'video/getRating',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getRating(id);
      return response.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while getting rate video';
      return rejectWithValue(error.result.error);
    }
  }
);

export const ratingVideo = createAsyncThunk(
  'video/rating',
  async (
    { id, type }: { id: string; type: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await videoAPI.rating(id, type);
      await dispatch(getVideoRating(id));
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while rating video';
      return rejectWithValue(error.result.error);
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: { resetVideo: () => initialState },
  extraReducers: (builder) => {
    builder.addCase(fetchVideoById.fulfilled, (state, { payload }) => {
      if (!payload.items?.length) {
        state.isFetching = 'failed';
        return;
      }

      state.isFetching = 'succeed';
      state.data = payload.items![0];
    });

    builder.addCase(getVideoRating.fulfilled, (state, { payload }) => {
      state.rating = payload.items![0];
    });
  },
});

export const { resetVideo } = videoSlice.actions;

export const selectVideoIsFetching = (state: RootState) => state.video.isFetching;
export const selectVideo = (state: RootState) => state.video.data;
export const selectRating = (state: RootState) => state.video.rating?.rating;

export default videoSlice.reducer;
