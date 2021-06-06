import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useComment from 'app/useComment';
import Spinner from 'components/Spinner';
import React from 'react';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentPost from './CommentPost';

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

  const observer = React.useRef<any>(null);
  const loader = React.useRef<HTMLDivElement | null>(null);

  const [load, setLoad] = React.useState(false);
  const [sorting, setSorting] = React.useState(false);

  const { data, error } = useComment(videoId, load);

  React.useEffect(() => {
    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        setLoad(true);
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver);

    if (loader.current) {
      observer.current.observe(loader.current);
    }

    return () => observer.current.disconnect();
    // eslint-disable-next-line
  }, []);

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
      <div ref={loader} className={classes.loader}>
        <Spinner />
      </div>
    );

  return (
    <Box position='relative' maxWidth='805px'>
      <div className={`${sorting ? classes.opacity : ''}`}>
        <CommentHeader sorting={handleSorting} />
        <CommentPost videoId={videoId} channelId={channelId} />
        {data.map((item: gapi.client.youtube.CommentThread) => (
          <CommentItem key={item.id} item={item} player={player} />
        ))}
      </div>
      {sorting && (
        <div className={classes.sortingLoader}>
          <Spinner />
        </div>
      )}
    </Box>
  );
});
