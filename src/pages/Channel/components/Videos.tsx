import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import usePlaylistItems from 'app/usePlaylistItems';
import InfiniteScroll from 'components/InfiniteScroll';
import Spinner from 'components/Spinner';
import React from 'react';
import VideoItem from './VideoItem';
import VideosSkeleton from './VideosSkeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 210px)',
      gap: '24px 4px',
      justifyContent: 'center',
    },

    loader: {
      margin: '24px auto',
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
  const playlistId = channelData?.contentDetails?.relatedPlaylists?.uploads;
  const { data, error, setSize } = usePlaylistItems(
    channelData?.contentDetails?.relatedPlaylists?.uploads
  );

  let nextPageToken: string | undefined;
  if (data) {
    nextPageToken = data[data?.length - 1].nextPageToken;
  }

  const fetchMoreData = async () => {
    await setSize((size) => size + 1);
  };

  if (error) {
    if (error.code === 404 && error.errors[0].reason === 'playlistNotFound') {
      return (
        <Box mb='24px'>
          <Box textAlign='center'>Kênh này không có video nào.</Box>
        </Box>
      );
    }
  }

  if (!data || !playlistId) {
    return (
      <div className={classes.grid}>
        <VideosSkeleton num={10} />
      </div>
    );
  }

  return (
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
  );
});
