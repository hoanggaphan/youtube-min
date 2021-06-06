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
      margin: '24px auto 0',
      width: 'fit-content',
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
  const { data, error } = useComment(videoId);
  const [sorting, setSorting] = React.useState(false);

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

  if (!data)
    return (
      <div className={classes.loader}>
        <Spinner />
      </div>
    );

  const handleSorting = (status: boolean) => {
    setSorting(status);
  };
  
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
