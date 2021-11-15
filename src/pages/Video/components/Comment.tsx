import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import * as commentAPI from 'api/commentAPI';
import InfiniteScroll from 'components/InfiniteScroll';
import Spinner from 'components/Spinner';
import useIsMounted from 'hooks/useIsMounted';
import React from 'react';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentPost from './CommentPost';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    link: {
      textDecoration: 'none',
      color: 'rgb(6, 95, 212)',
    },
    loader: {
      display: 'inline-block',
      width: '100%',
      textAlign: 'center',
      marginTop: '24px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(0,0,0,.11)',
    },
  });
});

export default React.memo(function Comments({ videoId }: { videoId: string }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('relevance');
  const isMounted = useIsMounted();
  const [data, setData] = React.useState<
    gapi.client.youtube.CommentThreadListResponse[] | undefined
  >();
  const [error, setError] = React.useState<any>();

  React.useEffect(() => {
    commentAPI
      .fetchListByVideoId(videoId, order)
      .then((res) => isMounted() && setData([res.result]))
      .catch((err) => isMounted() && setError(err.result.error));
    // eslint-disable-next-line
  }, [order]);

  if (error) {
    if (
      error.info.code === 403 &&
      error.info.errors[0].reason === 'commentsDisabled'
    ) {
      return (
        <Box mt='24px' textAlign='center'>
          {error.message}
          <a
            className={classes.link}
            href='https://support.google.com/youtube/answer/9706180?hl=vi'
            target='__blank'
            rel='noopener noreferrer nofollow'
          >
            Tìm hiểu thêm
          </a>
        </Box>
      );
    }

    return <>{error.message}</>;
  }

  const fetchMoreData = async () => {
    if (!data) return;
    try {
      const res = await commentAPI.fetchListByVideoId(
        videoId,
        order,
        50,
        data[data?.length - 1].nextPageToken
      );
      setData([...data, res.result]);
    } catch (err) {
      setError((err as any).result.error);
    }
  };

  const handleSort = (order: string) => {
    setOrder(order);
  };

  const handleAddComment = (
    res: gapi.client.Response<gapi.client.youtube.CommentThread>
  ) => {
    const newComment = res.result;
    const newData = [...data!];
    newData[0].items?.unshift(newComment);
    setData(newData);
  };

  return (
    <Box position='relative'>
      <CommentHeader order={order} onSort={handleSort} />

      <CommentPost videoId={videoId} addComment={handleAddComment} />

      {!data ? (
        <>
          {[...new Array(3)].map((item, index) => (
            <Box key={index} mb='16px' display='flex' alignItems='center'>
              <Box mr='16px'>
                <Skeleton
                  animation={false}
                  variant='circle'
                  className={classes.avatar}
                />
              </Box>

              <Box width='100%'>
                <Skeleton animation={false} width='50%' />
                <Skeleton animation={false} width='30%' />
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <InfiniteScroll
          next={fetchMoreData}
          hasMore={!!data[data.length - 1].nextPageToken}
          loader={
            <div className={classes.loader}>
              <Spinner />
            </div>
          }
        >
          {data?.map((comment, index) => (
            <div key={index}>
              {comment.items?.map((item: gapi.client.youtube.CommentThread) => (
                <CommentItem key={item.id} item={item} />
              ))}
            </div>
          ))}
        </InfiniteScroll>
      )}
    </Box>
  );
});
