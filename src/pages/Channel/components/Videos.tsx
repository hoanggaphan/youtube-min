import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import usePlaylistItems from 'app/usePlaylistItems';
import InfiniteScroll from 'components/InfiniteScroll';
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

export default React.memo(function Videos({
  channelData,
}: {
  channelData: undefined | gapi.client.youtube.Channel;
}): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const playlistId = channelData?.contentDetails?.relatedPlaylists?.uploads;
  const { data, error, setSize } = usePlaylistItems(
    channelData?.contentDetails?.relatedPlaylists?.uploads
  );

  let nextPageToken: string | undefined;
  if (data) {
    nextPageToken = data[data?.length - 1].nextPageToken;
  }

  const fetchMoreData = async () => {
    try {
      await setSize((size) => size + 1);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

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

  if (!data || !playlistId) {
    return (
      <Box mb='24px'>
        <div className={classes.grid}>
          <VideosSkeleton num={10} />
        </div>
      </Box>
    );
  }

  return (
    <Box mb='24px'>
      <InfiniteScroll
        next={fetchMoreData}
        hasMore={!!nextPageToken}
        loader={
          <div className={classes.loader}>
            <Spinner />
          </div>
        }
        options={{ rootMargin: '0px 0px 400px 0px' }}
      >
        <div className={classes.grid}>
          {data?.map((playlist) =>
            playlist.items?.map((item: any) => (
              <VideoItem key={item.id} item={item} />
            ))
          )}
        </div>
      </InfiniteScroll>
    </Box>
  );
});
