import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as playlistItemsAPI from 'api/playListItemsAPI';
import * as videoAPI from 'api/videoAPI';
import { RootState } from 'app/store';

interface PlaylistItemsState {
  nextPageToken: string | undefined;
  playListItems: any;
  error: string | null;
}

const initialState: PlaylistItemsState = {
  nextPageToken: undefined,
  playListItems: [],
  error: null,
};

export const fetchPlaylistItems = createAsyncThunk(
  'playListItems/fetchList',
  async (playlistId: string, { rejectWithValue }) => {
    try {
      // fetch videos list
      const resPlaylistItems = await playlistItemsAPI.fetchListById(playlistId);

      // ids for call api to get videos views
      const ids = resPlaylistItems.result.items?.map(
        (item: gapi.client.youtube.PlaylistItem) =>
          item.snippet?.resourceId?.videoId!
      )!;

      // fetch videos views
      const resVideos = await videoAPI.fetchVideosViews(ids);
      const videosItems = resVideos.result.items!;

      resPlaylistItems.result.items?.forEach((pItem: any) => {
        const index = videosItems.findIndex(
          (vItem: gapi.client.youtube.Video) =>
            vItem.id === pItem.snippet.resourceId.videoId
        );

        pItem.snippet.viewCount = videosItems[index].statistics?.viewCount;
        pItem.snippet.duration = videosItems[index].contentDetails?.duration;
        return pItem;
      });

      return resPlaylistItems.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message =
        'An error occurred while fetching playlistItems';
      return rejectWithValue(error.result.error);
    }
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
    { rejectWithValue }
  ) => {
    try {
      // fetch videos list
      const resPlaylistItems = await playlistItemsAPI.fetchNextListById(
        playlistId,
        nextPageToken
      );

      // ids for call api to get videos views
      const ids = resPlaylistItems.result.items?.map(
        (item: gapi.client.youtube.PlaylistItem) =>
          item.snippet?.resourceId?.videoId!
      )!;

      // fetch videos views
      const resVideos = await videoAPI.fetchVideosViews(ids);
      const videosItems = resVideos.result.items!;

      resPlaylistItems.result.items?.forEach((pItem: any) => {
        const index = videosItems.findIndex(
          (vItem: gapi.client.youtube.Video) =>
            vItem.id === pItem.snippet.resourceId.videoId
        );

        pItem.snippet.viewCount = videosItems[index].statistics?.viewCount;
        pItem.snippet.duration = videosItems[index].contentDetails?.duration;
        return pItem;
      });

      return resPlaylistItems.result;
    } catch (error) {
      // All errors will be handled at component
      error.result.error.message =
        'An error occurred while fetching next playlistItems';
      return rejectWithValue(error.result.error);
    }
  }
);

const playlistItemsSlice = createSlice({
  name: 'playListItems',
  initialState,
  reducers: {
    resetPlayListItems: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlaylistItems.rejected, (state, { payload }) => {
      const error: any = payload;
      if (error.code === 404 && error.errors[0].reason === 'playlistNotFound') {
        state.error = 'Kênh này không có video nào.';
        return;
      }
    });
    builder.addCase(fetchPlaylistItems.fulfilled, (state, action) => {
      state.nextPageToken = action.payload.nextPageToken;
      state.playListItems = action.payload.items!;
    });

    builder.addCase(fetchNextPlaylistItems.fulfilled, (state, { payload }) => {
      state.nextPageToken = payload.nextPageToken;
      state.playListItems.push(...payload.items!);
    });
  },
});

export const { resetPlayListItems } = playlistItemsSlice.actions;

export const selectPlaylistItemsError = (state: RootState) =>
  state.playListItems.error;
export const selectPlaylistItems = (state: RootState) =>
  state.playListItems.playListItems;
export const selectNextPageToken = (state: RootState) =>
  state.playListItems.nextPageToken;

export default playlistItemsSlice.reducer;
