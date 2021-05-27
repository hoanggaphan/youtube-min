import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  getVideoRating,
  ratingVideo,
  selectRating,
  selectVideo,
} from 'app/videoSlice';
import { formatLikeCount } from 'helpers/format';
import useQuery from 'hooks/useQuery';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    iconBtn: {
      padding: '5px',
    },
    likeContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    likeCountText: {
      fontWeight: 500,
    },
    tooltip: {
      margin: '0',
    },
    tooltipText: {
      fontSize: '12px',
    },
  });
});

export default React.memo(function LikeDisLike(): JSX.Element {
  const classes = useStyles();
  const query = useQuery();
  const id = query.get('v') || '';
  const dispatch = useAppDispatch();
  const rating = useAppSelector(selectRating);
  const videoData = useAppSelector(selectVideo);
  const likeCount = videoData?.statistics?.likeCount;
  const dislikeCount = videoData?.statistics?.dislikeCount;

  const handleRate = (type: string) => {
    if (!rating) return;

    dispatch(ratingVideo({ id, type }))
      .then(unwrapResult)
      .catch((error) => alert(error.message));
  };

  React.useEffect(() => {
    dispatch(getVideoRating(id))
      .then(unwrapResult)
      .catch((error) => console.log(error.message));
    // eslint-disable-next-line
  }, []);

  return (
    <Box display='flex' minWidth='135px'>
      <Tooltip
        className={classes.tooltip}
        title={<span className={classes.tooltipText}>Tôi thích video này</span>}
        placement='bottom'
      >
        <div className={classes.likeContainer}>
          {rating === 'like' ? (
            <IconButton
              onClick={() => handleRate('none')}
              className={classes.iconBtn}
              color='primary'
            >
              <ThumbUpIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleRate('like')}
              className={classes.iconBtn}
            >
              <ThumbUpIcon />
            </IconButton>
          )}
          <span className={classes.likeCountText}>
            {likeCount && formatLikeCount(likeCount)}
          </span>
        </div>
      </Tooltip>
      <Tooltip
        title={
          <span className={classes.tooltipText}>Tôi không thích video này</span>
        }
        placement='bottom'
      >
        <Box ml='15px' className={classes.likeContainer}>
          {rating === 'dislike' ? (
            <IconButton
              onClick={() => handleRate('none')}
              className={classes.iconBtn}
              color='primary'
            >
              <ThumbDownIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleRate('dislike')}
              className={classes.iconBtn}
            >
              <ThumbDownIcon />
            </IconButton>
          )}

          <span className={classes.likeCountText}>
            {dislikeCount && formatLikeCount(dislikeCount)}
          </span>
        </Box>
      </Tooltip>
    </Box>
  );
});
