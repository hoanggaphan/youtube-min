import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import * as videoAPI from 'api/videoAPI';
import { formatLikeCount } from 'helpers/format';
import useQuery from 'hooks/useQuery';
import React from 'react';
import useSWR from 'swr';

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
    tooltipText: {
      fontSize: '12px',
    },
    snackBar: {
      whiteSpace: 'pre-wrap',
    },
  });
});

const fetchVideoRating = async (url: string, videoId: string) => {
  try {
    const response = await videoAPI.getRating(videoId);
    return response.result.items![0];
  } catch (error) {
    // All errors will be handled at component
    error.result.error.message = 'An error occurred while getting rate video';
    throw error.result.error;
  }
};

export default React.memo(function LikeDisLike({
  videoData,
}: {
  videoData: gapi.client.youtube.Video;
}): JSX.Element {
  const classes = useStyles();
  const query = useQuery();
  const id = query.get('v') || '';
  const { data, isValidating, mutate } = useSWR(
    ['api/video/getRating', id],
    fetchVideoRating
  );

  const rating = data?.rating;
  const likeCount = videoData?.statistics?.likeCount;
  const dislikeCount = videoData?.statistics?.dislikeCount;

  const [open, setOpen] = React.useState(true);

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleRate = async (type: string) => {
    if (!rating) return;

    try {
      await videoAPI.rating(id, type);
      mutate();
    } catch (error) {
      // console.log(error)
      alert('An error occurred while rating video');
    }
  };

  return (
    <Box display='flex'>
      {!isValidating && !data && (
        <Snackbar
          className={classes.snackBar}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={
            "An error occurred while getting rate video. Can't not find video id"
          }
          action={
            <>
              <Button color='secondary' size='small' onClick={handleClose}>
                UNDO
              </Button>
              <IconButton
                size='small'
                aria-label='close'
                color='inherit'
                onClick={handleClose}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </>
          }
        />
      )}

      <Tooltip
        title={<span className={classes.tooltipText}>Tôi thích video này</span>}
        placement='bottom'
      >
        <Box mr='7.5px' className={classes.likeContainer}>
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
        </Box>
      </Tooltip>
      <Tooltip
        title={
          <span className={classes.tooltipText}>Tôi không thích video này</span>
        }
        placement='bottom'
      >
        <Box ml='7.5px' pr='6px' className={classes.likeContainer}>
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
