import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as playlistItemsAPI from 'api/playListItemsAPI';
import { RootState } from 'app/store';

interface PlaylistItemsState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  nextPageToken: string | undefined;
  playListItems: any;
}

const initialState: PlaylistItemsState = {
  loading: 'idle',
  nextPageToken: undefined,
  playListItems: [],
};

export const fetchPlaylistItems = createAsyncThunk(
  'playListItems/fetchList',
  async (playlistId: string, thunkApi) => {
    // fetch videos list
    const resPlaylistItems = await playlistItemsAPI.fetchListById(playlistId);
    if (resPlaylistItems.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resPlaylistItems.result);
    }

    // ids for call api to get videos views
    const ids = resPlaylistItems.result.items.map(
      (item: any) => item.snippet.resourceId.videoId
    );

    // fetch videos views
    const resVideos = await playlistItemsAPI.fetchVideosViews(ids);
    if (resVideos.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resVideos.result);
    }

    const videosItems = resVideos.result.items;

    resPlaylistItems.result.items.forEach((pItem: any) => {
      const index = videosItems.findIndex(
        (vItem: any) => vItem.id === pItem.snippet.resourceId.videoId
      );

      pItem.snippet.viewCount = videosItems[index].statistics.viewCount;
      pItem.snippet.duration = videosItems[index].contentDetails.duration;
      return pItem;
    });

    return resPlaylistItems.result;
  }
);

export const fetchNextPlaylistItems = createAsyncThunk(
  'playListItems/fetchNextList',
  async (
    {
      playlistId,
      nextPageToken,
    }: {
      playlistId: string;
      nextPageToken: string | undefined;
    },
    thunkApi
  ) => {
    // fetch videos list
    const resPlaylistItems = await playlistItemsAPI.fetchNextListById(
      playlistId,
      nextPageToken
    );
    if (resPlaylistItems.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resPlaylistItems.result);
    }

    // ids for call api to get videos views
    const ids = resPlaylistItems.result.items.map(
      (item: any) => item.snippet.resourceId.videoId
    );

    // fetch videos views
    const resVideos = await playlistItemsAPI.fetchVideosViews(ids);
    if (resVideos.status !== 200) {
      // Return the known error for future handling
      return thunkApi.rejectWithValue(resVideos.result);
    }

    const videosItems = resVideos.result.items;

    resPlaylistItems.result.items.forEach((pItem: any) => {
      const index = videosItems.findIndex(
        (vItem: any) => vItem.id === pItem.snippet.resourceId.videoId
      );

      pItem.snippet.viewCount = videosItems[index].statistics.viewCount;
      pItem.snippet.duration = videosItems[index].contentDetails.duration;
      return pItem;
    });

    return resPlaylistItems.result;
  }
);

const playlistItemsSlice = createSlice({
  name: 'playListItems',
  initialState,
  reducers: {
    resetPlayListItems: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlaylistItems.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchPlaylistItems.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchPlaylistItems.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.nextPageToken = action.payload.nextPageToken;
      state.playListItems = action.payload.items;
    });
    builder.addCase(fetchNextPlaylistItems.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchNextPlaylistItems.rejected, (state, action) => {
      state.loading = 'failed';
      console.error(action.payload);
    });
    builder.addCase(fetchNextPlaylistItems.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.nextPageToken = action.payload.nextPageToken;
      state.playListItems.push(...action.payload.items);
    });
  },
});

export const { resetPlayListItems } = playlistItemsSlice.actions;

export const selectLoading = (state: RootState) => state.playListItems.loading;
export const selectPlaylistItems = (state: RootState) =>
  state.playListItems.playListItems;
export const selectNextPageToken = (state: RootState) =>
  state.playListItems.nextPageToken;

export default playlistItemsSlice.reducer;
