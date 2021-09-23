import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import * as videoAPI from 'api/videoAPI';
import WithLoginPopup from 'components/WithLoginPopup';
import { formatLikeCount } from 'helpers/format';
import { useAuth } from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
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
    loginBtn: {
      padding: '0',

      '&:hover': {
        backgroundColor: 'unset',
      },
    },
  });
});

const fetchVideoRating = async (url: string, videoId: string) => {
  try {
    const response = await videoAPI.getRating(videoId);
    return response.result.items![0];
  } catch (error) {
    // All errors will be handled at component
    throw new Error('An error occurred while getting rate video');
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

  const { user } = useAuth();

  const { data, mutate } = useSWR(
    user ? ['api/video/getRating', id] : null,
    fetchVideoRating
  );

  const rating = data?.rating;
  const likeCount = videoData?.statistics?.likeCount;
  const dislikeCount = videoData?.statistics?.dislikeCount;
  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line
  const handleRate = async (type: string) => {
    if (!rating) return;

    try {
      await videoAPI.rating(id, type);
      mutate();
    } catch (error) {
      enqueueSnackbar('An error occurred while rating video', {
        variant: 'error',
      });
    }
  };

  const off = () => {
    enqueueSnackbar('Chức năng này đã bị tắt', {
      variant: 'warning',
    });
  };

  return (
    <Box display='flex'>
      {user ? (
        <Tooltip
          title={
            <span className={classes.tooltipText}>Tôi thích video này</span>
          }
          placement='bottom'
        >
          <Box mr='7.5px'>
            <div className={classes.likeContainer}>
              <IconButton
                onClick={off}
                // onClick={() => handleRate(rating === 'like' ? 'none' : 'like')}
                color={rating === 'like' ? 'primary' : 'default'}
                className={classes.iconBtn}
              >
                <ThumbUpIcon />
              </IconButton>
              <span className={classes.likeCountText}>
                {likeCount && formatLikeCount(likeCount)}
              </span>
            </div>
          </Box>
        </Tooltip>
      ) : (
        <WithLoginPopup
          title={'Bạn thích video này?'}
          content={'Đăng nhập để thể hiện ý kiến của bạn.'}
        >
          <Tooltip
            title={
              <span className={classes.tooltipText}>Tôi thích video này</span>
            }
            placement='bottom'
          >
            <Box mr='7.5px'>
              <div className={classes.likeContainer}>
                <IconButton className={classes.iconBtn}>
                  <ThumbUpIcon />
                </IconButton>
                <span className={classes.likeCountText}>
                  {likeCount && formatLikeCount(likeCount)}
                </span>
              </div>
            </Box>
          </Tooltip>
        </WithLoginPopup>
      )}

      {user ? (
        <Tooltip
          title={
            <span className={classes.tooltipText}>
              Tôi không thích video này
            </span>
          }
          placement='bottom'
        >
          <Box ml='7.5px' pr='6px' className={classes.likeContainer}>
            <IconButton
              onClick={off}
              // onClick={() =>
              //   handleRate(rating === 'dislike' ? 'none' : 'dislike')
              // }
              className={classes.iconBtn}
              color={rating === 'dislike' ? 'primary' : 'default'}
            >
              <ThumbDownIcon />
            </IconButton>
            <span className={classes.likeCountText}>
              {dislikeCount && formatLikeCount(dislikeCount)}
            </span>
          </Box>
        </Tooltip>
      ) : (
        <WithLoginPopup
          title={'Bạn thích video này?'}
          content={'Đăng nhập để thể hiện ý kiến của bạn.'}
        >
          <Tooltip
            title={
              <span className={classes.tooltipText}>
                Tôi không thích video này
              </span>
            }
            placement='bottom'
          >
            <Box ml='7.5px' pr='6px'>
              <div className={classes.likeContainer}>
                <IconButton className={classes.iconBtn}>
                  <ThumbDownIcon />
                </IconButton>
                <span className={classes.likeCountText}>
                  {dislikeCount && formatLikeCount(dislikeCount)}
                </span>
              </div>
            </Box>
          </Tooltip>
        </WithLoginPopup>
      )}
    </Box>
  );
});
