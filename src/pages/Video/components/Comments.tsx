import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useComment from 'app/useComment';
import Spinner from 'components/Spinner';
import React from 'react';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentPost from './CommentPost';
import * as commentAPI from 'api/commentAPI';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    loader: {
      display: 'inline-block',
      width: '100%',
      textAlign: 'center',
      marginTop: '24px',
    },
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
  });
});

export default React.memo(function Comments({
  videoId,
  channelId,
  player,
}: {
  videoId: string;
  channelId: string;
  player?: any;
}) {
  const classes = useStyles();

  const observerLoaderF = React.useRef<any>(null);
  const loaderF = React.useRef<HTMLDivElement | null>(null);

  const observerLoaderM = React.useRef<any>(null);
  const loaderM = React.useRef<HTMLDivElement | null>(null);

  const [load, setLoad] = React.useState(false);
  const [sorting, setSorting] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { data, error, mutate } = useComment(videoId, load);
  const { enqueueSnackbar } = useSnackbar();

  // Lazy First Load Comment
  React.useEffect(() => {
    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        setLoad(true);
      }
    };

    if (observerLoaderF.current) observerLoaderF.current.disconnect();

    observerLoaderF.current = new IntersectionObserver(handleObserver);

    if (loaderF.current) {
      observerLoaderF.current.observe(loaderF.current);
    }

    return () => observerLoaderF.current.disconnect();
    // eslint-disable-next-line
  }, []);

  // Lazy Load More Comment
  React.useEffect(() => {
    if (!data) return;

    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        try {
          const res = await commentAPI.fetchListByVideoId(
            videoId,
            data.nextPageToken,
            30,
            selectedIndex === 0 ? 'relevance' : 'time'
          );

          const newItems = [...data.items!, ...res.result.items!];
          res.result.items = newItems;
          mutate(res.result, false);
        } catch (err) {
          enqueueSnackbar('An error occurred while fetching next comment');
        }
      }
    };

    if (observerLoaderM.current) observerLoaderM.current.disconnect();

    observerLoaderM.current = new IntersectionObserver(handleObserver);

    if (loaderM.current) {
      observerLoaderM.current.observe(loaderM.current);
    }

    return () => observerLoaderM.current.disconnect();
    // eslint-disable-next-line
  }, [data]);

  if (error) {
    if (error.code === 403 && error.errors[0].reason === 'commentsDisabled') {
      return (
        <Box mt='24px' textAlign='center'>
          Tính năng bình luận đã bị tắt.
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

  const handleSorting = (status: boolean) => {
    setSorting(status);
  };

  if (!data)
    return (
      <div ref={loaderF} className={classes.loader}>
        <Spinner />
      </div>
    );

  return (
    <Box position='relative' maxWidth='805px'>
      <div className={`${sorting ? classes.opacity : ''}`}>
        <CommentHeader
          sorting={handleSorting}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />

        <CommentPost videoId={videoId} channelId={channelId} />

        {data.items?.map((item: gapi.client.youtube.CommentThread) => (
          <CommentItem key={item.id} item={item} player={player} />
        ))}

        <div ref={loaderM} className={classes.loader}>
          <Spinner />
        </div>
      </div>

      {sorting && (
        <div className={classes.sortingLoader}>
          <Spinner />
        </div>
      )}
    </Box>
  );
});
