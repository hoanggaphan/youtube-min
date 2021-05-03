import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as playListItemsAPI from 'api/playListItemsAPI';
import { RootState } from 'app/store';

interface PlayListItemsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  nextPageToken: string | undefined;
  playListItems: any;
}

const initialState: PlayListItemsState = {
  loading: 'idle',
  nextPageToken: undefined,
  playListItems: [],
};

export const fetchPlayListItems = createAsyncThunk(
  'playListItems/fetchList',
  async (playListId: string, thunkApi) => {
    // fetch videos list
    const resPlayListItems = await playListItemsAPI.fetchListById(playListId);
    if (resPlayListItems.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resPlayListItems.result);
    }

    // ids for call api to get videos views
    const ids = resPlayListItems.result.items.map(
      (item: any) => item.snippet.resourceId.videoId
    );

    // fetch videos views
    const resVideos = await playListItemsAPI.fetchVideosViews(ids);
    if (resVideos.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resVideos.result);
    }

    const videosItems = resVideos.result.items;

    resPlayListItems.result.items.forEach((pItem: any) => {
      const index = videosItems.findIndex(
        (vItem: any) => vItem.id === pItem.snippet.resourceId.videoId
      );

      pItem.snippet.viewCount = videosItems[index].statistics.viewCount;
      pItem.snippet.duration = videosItems[index].contentDetails.duration;
      return pItem;
    });

    return resPlayListItems.result;
  }
);

export const fetchNextPlayListItems = createAsyncThunk(
  'playListItems/fetchNextList',
  async (
    {
      playListId,
      nextPageToken,
    }: {
      playListId: string;
      nextPageToken: string | undefined;
    },
    thunkApi
  ) => {
    // fetch videos list
    const resPlayListItems = await playListItemsAPI.fetchNextListById(
      playListId,
      nextPageToken
    );
    if (resPlayListItems.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resPlayListItems.result);
    }

    // ids for call api to get videos views
    const ids = resPlayListItems.result.items.map(
      (item: any) => item.snippet.resourceId.videoId
    );

    // fetch videos views
    const resVideos = await playListItemsAPI.fetchVideosViews(ids);
    if (resVideos.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resVideos.result);
    }

    const videosItems = resVideos.result.items;

    resPlayListItems.result.items.forEach((pItem: any) => {
      const index = videosItems.findIndex(
        (vItem: any) => vItem.id === pItem.snippet.resourceId.videoId
      );

      pItem.snippet.viewCount = videosItems[index].statistics.viewCount;
      pItem.snippet.duration = videosItems[index].contentDetails.duration;
      return pItem;
    });

    return resPlayListItems.result;
  }
);

const playListItemsSlice = createSlice({
  name: 'playListItems',
  initialState,
  reducers: {
    resetPlayListItems: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlayListItems.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchPlayListItems.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchPlayListItems.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.nextPageToken = action.payload.nextPageToken;
      state.playListItems = action.payload.items;
    });
    builder.addCase(fetchNextPlayListItems.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchNextPlayListItems.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchNextPlayListItems.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.nextPageToken = action.payload.nextPageToken;
      state.playListItems.push(...action.payload.items);
    });
  },
});

export const { resetPlayListItems } = playListItemsSlice.actions;

export const selectLoading = (state: RootState) => state.playListItems.loading;
export const selectPlayListItems = (state: RootState) =>
  state.playListItems.playListItems;
export const selectNextPageToken = (state: RootState) =>
  state.playListItems.nextPageToken;

export default playListItemsSlice.reducer;
