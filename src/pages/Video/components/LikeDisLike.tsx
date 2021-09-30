import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import * as videoAPI from 'api/videoAPI';
import StyledTooltip from 'components/StyledTooltip';
import WithLoginPopup from 'components/WithLoginPopup';
import { formatLikeCount } from 'helpers/format';
import { useAuth } from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React from 'react';
import useSWR from 'swr';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';

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
      textTransform: 'uppercase',
      userSelect: 'none',
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
        <>
          <StyledTooltip
            title={
              <span className={classes.tooltipText}>Tôi thích video này</span>
            }
            placement='bottom'
          >
            <Box mr='7.5px'>
              <div
                onClick={off}
                // onClick={() => handleRate(rating === 'like' ? 'none' : 'like')}
                className={classes.likeContainer}
              >
                <IconButton className={classes.iconBtn}>
                  {rating === 'like' ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                </IconButton>
                <span className={classes.likeCountText}>
                  {likeCount ? formatLikeCount(likeCount) : 'Thích'}
                </span>
              </div>
            </Box>
          </StyledTooltip>

          <StyledTooltip
            title={
              <span className={classes.tooltipText}>
                Tôi không thích video này
              </span>
            }
            placement='bottom'
          >
            <Box
              onClick={off}
              className={classes.likeContainer}
              // onClick={() =>
              //   handleRate(rating === 'dislike' ? 'none' : 'dislike')
              // }
              ml='7.5px'
              pr='6px'
            >
              <IconButton className={classes.iconBtn}>
                {rating === 'dislike' ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOutlinedIcon />
                )}
              </IconButton>
              <span className={classes.likeCountText}>
                {dislikeCount ? formatLikeCount(dislikeCount) : 'Không thích'}
              </span>
            </Box>
          </StyledTooltip>
        </>
      ) : (
        <>
          <WithLoginPopup
            title={'Bạn thích video này?'}
            content={'Đăng nhập để thể hiện ý kiến của bạn.'}
          >
            <StyledTooltip
              title={
                <span className={classes.tooltipText}>Tôi thích video này</span>
              }
              placement='bottom'
            >
              <Box mr='7.5px'>
                <div className={classes.likeContainer}>
                  <IconButton className={classes.iconBtn}>
                    <ThumbUpOutlinedIcon />
                  </IconButton>
                  <span className={classes.likeCountText}>
                    {likeCount ? formatLikeCount(likeCount) : 'Thích'}
                  </span>
                </div>
              </Box>
            </StyledTooltip>
          </WithLoginPopup>

          <WithLoginPopup
            title={'Bạn không thích video này?'}
            content={'Đăng nhập để thể hiện ý kiến của bạn.'}
          >
            <StyledTooltip
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
                    <ThumbDownOutlinedIcon />
                  </IconButton>
                  <span className={classes.likeCountText}>
                    {dislikeCount
                      ? formatLikeCount(dislikeCount)
                      : 'Không thích'}
                  </span>
                </div>
              </Box>
            </StyledTooltip>
          </WithLoginPopup>
        </>
      )}
    </Box>
  );
});
