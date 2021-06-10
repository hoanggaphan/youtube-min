import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as playlistItemsAPI from 'api/playListItemsAPI';
import * as videoAPI from 'api/videoAPI';
import usePlaylistItems from 'app/usePlaylistItems';
import Spinner from 'components/Spinner';
import { useSnackbar } from 'notistack';
import React from 'react';
import VideoItem from './VideoItem';
import VideosSkeleton from './VideosSkeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: '210px',
      gap: '24px 4px',
      justifyContent: 'center',

      '@media only screen and (min-width: 428px)': {
        gridTemplateColumns: 'repeat(2, 210px)',
      },
      '@media only screen and (min-width: 642px)': {
        gridTemplateColumns: 'repeat(3, 210px)',
      },
      '@media only screen and (min-width: 856px)': {
        gridTemplateColumns: 'repeat(4, 210px)',
      },
      '@media only screen and (min-width: 1070px)': {
        gridTemplateColumns: 'repeat(5, 210px)',
      },
    },

    loader: {
      margin: '24px auto 0',
      width: 'fit-content',
    },
  })
);

const fetchNextPlaylistItems = async (
  playlistId: string,
  nextPageToken: string
) => {
  try {
    // fetch videos list
    const resPlaylistItems = await playlistItemsAPI.fetchListById(
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
    throw error.result.error;
  }
};

export default React.memo(function Videos({
  channelData,
}: {
  channelData: undefined | gapi.client.youtube.Channel;
}): JSX.Element {
  const classes = useStyles();
  const loader = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<any>(null);

  const { enqueueSnackbar } = useSnackbar();

  const playlistId = channelData?.contentDetails?.relatedPlaylists?.uploads;

  const { data, error, isLoading, mutate } = usePlaylistItems(
    channelData?.contentDetails?.relatedPlaylists?.uploads
  );
  const playlistItemsData = data?.items!;
  const nextPageToken = data?.nextPageToken;

  React.useEffect(() => {
    if (!nextPageToken || !playlistId) return;

    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        try {
          const res = await fetchNextPlaylistItems(playlistId, nextPageToken);
          res.items = [...data?.items!, ...res.items!];
          await mutate(res, false);
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 400px 0px',
    });

    if (loader.current) {
      observer.current.observe(loader.current);
    }

    return () => observer.current.disconnect();
    // eslint-disable-next-line
  }, [nextPageToken, playlistId]);

  if (error) {
    return (
      <Box mb='24px'>
        <Box textAlign='center'>
          {error.code === 404 && error.errors[0].reason === 'playlistNotFound'
            ? 'Kênh này không có video nào.'
            : error.message}
        </Box>
      </Box>
    );
  }

  if (isLoading || !playlistId) {
    return (
      <Box mb='24px'>
        <div className={classes.grid}>
          <VideosSkeleton num={10} />
        </div>
      </Box>
    );
  }

  function renderList() {
    return playlistItemsData?.map((item: any) => (
      <VideoItem key={item.id} item={item} />
    ));
  }

  return (
    <Box mb='24px'>
      <div className={classes.grid}>{renderList()}</div>

      {nextPageToken && (
        <div ref={loader} className={classes.loader}>
          <Spinner />
        </div>
      )}
    </Box>
  );
});
