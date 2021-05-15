import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as commentAPI from 'api/commentAPI';
import React from 'react';
import { useParams } from 'react-router';
import { useSWRInfinite } from 'swr';
import CommentItem from './CommentItem';

const fetcher = async (videoId: string) => {
  const res = await commentAPI.fetchListByVideoId(videoId);
  return res.result;
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    loader: {
      '&::after': {
        content: '"•"',
        margin: '0 4px',
      },
    },
  });
});

export default React.memo(function Comments() {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const { data } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.items.length) return null; // reached the end
      return `/comment?page=${pageIndex}`; // SWR key
    },
    () => fetcher(id)
  );

  if (!data)
    return (
      <div className={classes.loader}>
        <CircularProgress size={30} color='inherit' />
      </div>
    );

  console.log(data[0].items);

  return (
    <Box mt='24px'>
      {data[0].items.map((item: any) => (
        <CommentItem key={item.id} item={item} />
      ))}
    </Box>
  );
});
