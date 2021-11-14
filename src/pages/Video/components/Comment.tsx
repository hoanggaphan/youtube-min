import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import useComments from 'app/useComments';
import InfiniteScroll from 'components/InfiniteScroll';
import Spinner from 'components/Spinner';
import React from 'react';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentPost from './CommentPost';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    sortingLoader: {
      position: 'absolute',
      left: '50%',
      top: '250px',
      transform: 'translateX(-50%)',
    },
    opacity: {
      opacity: '.25',
    },
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

export default React.memo(function Comments({
  videoId,
  player,
}: {
  videoId: string;
  player?: any;
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('relevance');
  const { data, error, hasNextPage, fetchNextPage } = useComments(
    videoId,
    order
  );

  if (error) {
    if (
      (error as any).info.code === 403 &&
      (error as any).info.errors[0].reason === 'commentsDisabled'
    ) {
      return (
        <Box mt='24px' textAlign='center'>
          {(error as any).message}
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

    return <>{(error as any).message}</>;
  }

  const fetchMoreData = async () => {
    await fetchNextPage();
  };

  const handleSort = (order: string) => {
    setOrder(order);
  };

  return (
    <Box position='relative'>
      {/* <div className={`${data && isLoading ? classes.opacity : ''}`}> */}
      <CommentHeader order={order} onSort={handleSort} />

      <CommentPost videoId={videoId} order={order} />

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
          hasMore={!!hasNextPage}
          loader={
            <div className={classes.loader}>
              <Spinner />
            </div>
          }
        >
          {data.pages.map((comment, index) => (
            <div key={index}>
              {comment.items?.map((item: gapi.client.youtube.CommentThread) => (
                <CommentItem key={item.id} item={item} player={player} />
              ))}
            </div>
          ))}
        </InfiniteScroll>
      )}
      {/* </div> */}

      {/* {sorting && (
          <div className={classes.sortingLoader}>
            <Spinner />
          </div>
        )} */}
    </Box>
  );
});
