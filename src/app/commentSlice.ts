import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import * as commentAPI from 'api/commentAPI';
import { RootState } from 'app/store';

interface commentState {
  data: null | gapi.client.youtube.CommentThread[];
  error: any;
}

const initialState: commentState = {
  data: null,
  error: null,
};

export const fetchCommentList = createAsyncThunk(
  'comment/fetchList',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await commentAPI.fetchListByVideoId(videoId);
      const data = res.result.items!;
      return data;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while fetching the data';
      return rejectWithValue(error.result.error);
    }
  }
);

export const insertComment = createAsyncThunk(
  'comment/insert',
  async (
    {
      videoId,
      channelId,
      text,
    }: { videoId: string; channelId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await commentAPI.insertByVideoId(videoId, text);
      return { channelId, data: res.result };
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message = 'An error occurred while inserting the data';
      return rejectWithValue(error.result.error);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    resetComment: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommentList.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
    builder.addCase(insertComment.fulfilled, (state, { payload }) => {
      const currentData = current(state.data);
      const firstComment = currentData![0];
      if (
        firstComment.snippet?.topLevelComment?.snippet?.authorChannelId
          ?.value === payload.channelId
      ) {
        state.data?.splice(1, 0, payload.data);
      } else {
        state.data?.unshift(payload.data);
      }
    });
  },
});

export const { resetComment } = commentSlice.actions;

export const selectComments = (state: RootState) => state.comment.data;
export const selectError = (state: RootState) => state.comment.error;

export default commentSlice.reducer;
