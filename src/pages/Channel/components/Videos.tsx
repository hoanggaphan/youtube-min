import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import usePlaylistItems from 'app/usePlaylistItems';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoItem from './VideoItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gap: '24px 4px',
      justifyContent: 'center',
      gridTemplateColumns: '250px',
      overflow: 'hidden!important',

      '@media (min-width: 400px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        justifyContent: 'flex-start',
      },

      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },

      '@media (min-width: 870px)': {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      },

      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
      },
    },

    loader: {
      margin: '24px auto',
      width: 'fit-content',
    },
    pt: {
      paddingTop: '56.25%',
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
  const { data, error, setSize } = usePlaylistItems(playlistId);

  let nextPageToken: string | undefined;
  if (data) {
    nextPageToken = data[data?.length - 1].nextPageToken;
  }

  const fetchMoreData = async () => {
    await setSize((size) => size + 1);
  };

  if (error) {
    return (
      <Box mb='24px'>
        <Box textAlign='center'>{error.message}</Box>
      </Box>
    );
  }

  if (data?.length === 1 && data[0].items?.length === 0) {
    return (
      <Box mb='24px'>
        <Box textAlign='center'>Kênh này không có video nào.</Box>
      </Box>
    );
  }

  if (!data || !playlistId) {
    return (
      <Box mb='24px'>
        <div className={classes.grid}>
          <VideoSkeleton num={10} />
        </div>
      </Box>
    );
  }

  return (
    <Box mb='24px'>
      <InfiniteScroll
        dataLength={data.reduce((prev, curr) => prev + curr.items!.length, 0)} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={!!nextPageToken}
        loader={<VideoSkeleton num={10} />}
        className={classes.grid}
      >
        <VideoList data={data} />
      </InfiniteScroll>
    </Box>
  );
});

const VideoList = React.memo(
  ({
    data,
  }: {
    data: gapi.client.youtube.PlaylistItemListResponse[];
  }): JSX.Element => {
    return (
      <>
        {data?.map((playlist) =>
          playlist.items?.map((item: any) => (
            <VideoItem key={item.id} item={item} />
          ))
        )}
      </>
    );
  }
);

const VideoSkeleton = React.memo(({ num }: { num: number }): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      {[...new Array(num)].map((item, index) => (
        <div key={index}>
          <Skeleton className={classes.pt} animation={false} variant='rect' />
          <Box pt={1} pr='24px'>
            <Skeleton animation={false} />
            <Skeleton animation={false} width='60%' />
          </Box>
        </div>
      ))}
    </>
  );
});
