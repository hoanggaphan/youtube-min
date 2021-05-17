import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as commentAPI from 'api/commentAPI';
import React from 'react';
import { useSWRInfinite } from 'swr';
import CommentItem from './CommentItem';

const fetcher = async (videoId: string) => {
  const res = await commentAPI.fetchListByVideoId(videoId);

  if (res.status !== 200) {
    const error: any = new Error('An error occurred while fetching the data.');
    error.info = res.result.error;
    error.status = res.status;
    throw error;
  }

  return res.result;
};

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

export default React.memo(function Comments({ id }: { id: string }) {
  const classes = useStyles();
  const { data, error } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.items.length) return null; // reached the end
      return `/comment?page=${pageIndex}`; // SWR key
    },
    () => fetcher(id),
    {
      shouldRetryOnError: false,
    }
  );

  if (error) {
    if (
      error.info.code === 403 &&
      error.info.errors[0].reason === 'commentsDisabled'
    ) {
      return (
        <Box mt='24px' textAlign='center'>
          Tính năng bình luận đã bị tắt.{' '}
          <a
            className={classes.link}
            href='https://support.google.com/youtube/answer/9706180?hl=vi'
            target='__blank'
            rel='noopener noreferrer nofollow'
          >
            Tìm hiểu thêm
          </a>{' '}
        </Box>
      );
    }

    return <>{error.message}</>;
  }

  if (!data)
    return (
      <div className={classes.loader}>
        <CircularProgress size={30} color='inherit' />
      </div>
    );

  return (
    <Box mt='24px'>
      {data[0].items?.map((item: any) => (
        <CommentItem key={item.id} item={item} />
      ))}
    </Box>
  );
});
