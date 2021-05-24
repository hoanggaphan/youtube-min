import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as commentAPI from 'api/commentAPI';
import React from 'react';
import CommentItem from './CommentItem';
import VideoCommentPost from './VideoCommentPost';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    loader: {
      margin: '24px auto 0',
      width: 'fit-content',
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
  const [data, setData] = React.useState<gapi.client.youtube.CommentThread[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await commentAPI.fetchListByVideoId(videoId);
        const items = res.result.items!;
        setData(items);
        setIsLoading(false);
      } catch (error) {
        const errorObj: any = new Error(
          'An error occurred while fetching the data.'
        );
        errorObj.info = error.result.error;
        errorObj.status = error.status;
        setError(errorObj);
      }
    }

    fetcher();
    // eslint-disable-next-line
  }, []);

  if (error) {
    if (
      error.info.code === 403 &&
      error.info.errors[0].reason === 'commentsDisabled'
    ) {
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

  const handlePostComment = async (text: string) => {
    try {
      const { result: newComment } = await commentAPI.insertByVideoId(
        videoId,
        text
      );
      const newData = [...data];
      const firstComment = data[0];

      if (
        firstComment.snippet?.topLevelComment?.snippet?.authorChannelId
          ?.value === channelId
      ) {
        newData.splice(1, 0, newComment);
      } else {
        newData.unshift(newComment);
      }

      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <div className={classes.loader}>
        <CircularProgress size={30} color='inherit' />
      </div>
    );

  return (
    <Box maxWidth='805px'>
      <VideoCommentPost onPostComment={handlePostComment} />
      {data.map((item: gapi.client.youtube.CommentThread) => (
        <CommentItem key={item.id} item={item} player={player} />
      ))}
    </Box>
  );
});
