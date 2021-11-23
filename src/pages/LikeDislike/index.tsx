import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as channelAPI from 'api/channelAPI';
import * as videoAPI from 'api/videoAPI';
import { isLogin } from 'hooks/useAuth';
import useIsMounted from 'hooks/useIsMounted';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory, useLocation } from 'react-router';
import List from './components/List';
import ListSkeleton from './components/ListSkeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '2.5rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.7rem',
      },
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 320px)',
      justifyContent: 'center',
      gap: '40px 16px',
      overflow: 'hidden!important',

      '@media (min-width: 500px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },

      '@media (min-width: 890px)': {
        gridTemplateColumns: 'repeat(3,  minmax(0, 1fr))',
      },

      '@media (min-width: 1144px)': {
        gridTemplateColumns: 'repeat(4,  minmax(0, 1fr))',
      },
    },
  })
);

const fetcher = async (rating: string, nextPageToken?: string) => {
  try {
    const resVideo = await videoAPI.fetchMyRatingVideos(
      rating,
      49,
      nextPageToken
    );

    if (resVideo.result.items?.length === 0) {
      return resVideo.result;
    }

    // ids for call api to get channel avatar
    const ids = resVideo.result.items?.map(
      (item: gapi.client.youtube.Video) => item.snippet?.channelId!
    )!;

    const resChannel = await channelAPI.fetchChannelById(ids);
    const channelItems = resChannel.result.items!;
    resVideo.result.items?.forEach((vItem: any) => {
      const index = channelItems.findIndex(
        (cItem: gapi.client.youtube.Channel) =>
          cItem.id === vItem.snippet.channelId
      );

      if (index !== -1) {
        vItem.snippet.channelAvatar =
          channelItems[index].snippet?.thumbnails?.default?.url;
      }

      return vItem;
    });

    return resVideo.result;
  } catch (err) {
    throw new Error('An error occurred while fetching videos');
  }
};

export default function Like({ rating }: { rating: string }) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const isMounted = useIsMounted();
  const [data, setData] = React.useState<
    gapi.client.youtube.VideoListResponse[] | undefined
  >();
  const [error, setError] = React.useState<any>();

  React.useEffect(() => {
    fetcher(rating)
      .then((res) => isMounted() && setData([res]))
      .catch((err) => isMounted() && setError(err));
    // eslint-disable-next-line
  }, []);

  if (!isLogin()) {
    return (
      <Box py='16px'>
        <Typography align='center' variant='h6'>
          <Link
            component='button'
            variant='h6'
            onClick={() => {
              history.push({
                pathname: '/login',
                state: { from: location },
              });
            }}
          >
            Đăng nhập
          </Link>{' '}
          để xem
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return (
      <div>
        <Box py='16px'>
          <Typography align='center' variant='h2' className={classes.title}>
            Video đã {rating}
          </Typography>
        </Box>
        <div className={classes.grid}>
          <ListSkeleton num={12} />
        </div>
      </div>
    );
  }

  if (data[0].pageInfo?.totalResults === 0) {
    return <div>Không có video nào</div>;
  }

  const fetchMoreData = () => {
    if (!data) return;
    fetcher(rating, data[data?.length - 1].nextPageToken)
      .then((res) => isMounted() && setData([...data, res]))
      .catch((err) => isMounted() && setError(err));
  };

  return (
    <div>
      <Box py='16px'>
        <Typography align='center' variant='h2' className={classes.title}>
          Video đã {rating}
        </Typography>
      </Box>
      <InfiniteScroll
        dataLength={data.reduce((prev, curr) => prev + curr.items!.length, 0)} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={!!data[data?.length - 1].nextPageToken}
        loader={<ListSkeleton num={8} />}
        className={classes.grid}
      >
        <List data={data} />
      </InfiniteScroll>
      <Box py='16px'></Box>
    </div>
  );
}
