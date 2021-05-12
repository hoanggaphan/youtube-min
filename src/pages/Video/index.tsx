import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  fetchChannelById,
  resetChannel,
  selectChannelSubscriberCount,
  selectChannelThumbUrl,
  selectChannelTitle,
} from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { checkSubscriptionExist, selectExist } from 'app/subscriptionSlice';
import {
  fetchVideoById,
  selectChannelId,
  selectLoading,
  selectVideoDescription,
  selectVideoDislikeCount,
  selectVideoLikeCount,
  selectVideoTitle,
} from 'app/videoSlice';
import FormattedString from 'components/FormattedString';
import MyContainer from 'components/MyContainer';
import SubscribeButton from 'components/SubscribeButton';
import {
  formatLikeCount,
  formatNumberWithDots,
  formatSubscriptionCount,
} from 'helpers/format';
import React from 'react';
import { useParams } from 'react-router';
import ViewDate from './components/ViewDate';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    iframeContainer: {
      position: 'relative',
      paddingTop: 'calc(9/16 * 100%)',
      backgroundColor: 'black',
    },
    iframeIconError: {
      color: '#999',
      fontSize: '10vw',
      marginRight: '7px',
    },
    iframeTextError: {
      color: 'white',
      fontSize: '24px',
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    superTitle: {
      marginRight: '3px',
      textDecoration: 'none',
      color: '#065fd4',
    },
    title: {
      fontSize: '18px',
    },
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
    metaContainer: {
      padding: '16px 0',
      borderTop: '1px solid #0000001a',
      borderBottom: '1px solid #0000001a',
    },
    avatar: {
      width: '48px',
      height: '48px',
      marginRight: '16px',
    },
    collapsed: {
      maxHeight: '60px',
      overflowY: 'hidden',
    },
    buttonMore: {
      marginTop: '8px',
      textTransform: 'uppercase',
      fontSize: '14px',
      fontWeight: 500,
      color: theme.palette.grey[700],
      cursor: 'pointer',
    },
  });
});

export default function Video(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const videoTitle = useAppSelector(selectVideoTitle);
  const likeCount = useAppSelector(selectVideoLikeCount);
  const dislikeCount = useAppSelector(selectVideoDislikeCount);
  const description = useAppSelector(selectVideoDescription);
  const avatarChannel = useAppSelector(selectChannelThumbUrl);
  const channelId = useAppSelector(selectChannelId);
  const channelTitle = useAppSelector(selectChannelTitle);
  const subscriberCount = useAppSelector(selectChannelSubscriberCount);
  const exist = useAppSelector(selectExist);
  const loading = useAppSelector(selectLoading);
  const [collapsed, setCollapsed] = React.useState(true);

  React.useEffect(() => {
    dispatch(fetchVideoById(id));
    return () => {
      dispatch(resetChannel());
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (!channelId) return;

    dispatch(fetchChannelById(channelId));
    dispatch(checkSubscriptionExist(channelId));
    // eslint-disable-next-line
  }, [channelId]);

  React.useEffect(() => {
    document.title = videoTitle + ' - Mini YouTube';
  }, [videoTitle]);

  return (
    <MyContainer>
      <Box p='24px'>
        {loading === 'failed' ? (
          <div className={classes.iframeContainer}>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              className={classes.iframe}
            >
              <ErrorOutlineIcon className={classes.iframeIconError} />
              <span className={classes.iframeTextError}>
                Video không có sẵn
              </span>
            </Box>
          </div>
        ) : (
          <div className={classes.iframeContainer}>
            {/* <iframe
              className={classes.iframe}
              title='Youtube video player'
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              allow='autoplay'
              frameBorder='0'
              allowFullScreen
            /> */}
          </div>
        )}

        <Box p='20px 0 8px 0'>
          {loading === 'failed' ? null : loading === 'succeeded' ? (
            <>
              <Typography variant='h5' className={classes.title}>
                {videoTitle}
              </Typography>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <ViewDate />

                <Box position='relative'>
                  <Box display='flex'>
                    <Tooltip
                      className={classes.tooltip}
                      title={
                        <span className={classes.tooltipText}>
                          Tôi thích video này
                        </span>
                      }
                      placement='bottom'
                    >
                      <div className={classes.likeContainer}>
                        <IconButton className={classes.iconBtn}>
                          <ThumbUpIcon />
                        </IconButton>
                        <span className={classes.likeCountText}>
                          {likeCount && formatLikeCount(likeCount)}
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip
                      title={
                        <span className={classes.tooltipText}>
                          Tôi không thích video này
                        </span>
                      }
                      placement='bottom'
                    >
                      <Box ml='15px' className={classes.likeContainer}>
                        <IconButton className={classes.iconBtn}>
                          <ThumbDownIcon />
                        </IconButton>
                        <span className={classes.likeCountText}>
                          {dislikeCount && formatLikeCount(dislikeCount)}
                        </span>
                      </Box>
                    </Tooltip>
                  </Box>
                  <Tooltip
                    title={
                      <span className={classes.tooltipText}>
                        {likeCount &&
                          dislikeCount &&
                          `${formatNumberWithDots(
                            likeCount
                          )} / ${formatNumberWithDots(dislikeCount)}`}
                      </span>
                    }
                    placement='top'
                  >
                    <Box
                      width='100%'
                      pt='6px'
                      pb='28px'
                      position='absolute'
                      left='0'
                    >
                      <Box height='2px' bgcolor='#737373'></Box>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Skeleton width='50%' height='34px' />
              <Box width='100%' display='flex' justifyContent='space-between'>
                <Skeleton width='30%' height='34px' />

                <Box display='flex' alignItems='center'>
                  <Box mx='8px'>
                    <Skeleton variant='circle' width='20px' height='20px' />
                  </Box>
                  <Box mx='8px'>
                    <Skeleton variant='circle' width='20px' height='20px' />
                  </Box>
                  <Box mx='8px'>
                    <Skeleton variant='circle' width='20px' height='20px' />
                  </Box>
                  <Box mx='8px'>
                    <Skeleton variant='circle' width='20px' height='20px' />
                  </Box>
                  <Box mx='8px'>
                    <Skeleton variant='circle' width='20px' height='20px' />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <div className={classes.metaContainer}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box display='flex' alignItems='center'>
              <Avatar src={avatarChannel} className={classes.avatar}>
                {channelTitle && channelTitle.charAt(0)}
              </Avatar>
              <div>
                <Typography variant='subtitle2'>{channelTitle}</Typography>
                <Typography variant='caption'>
                  {subscriberCount &&
                    `${formatSubscriptionCount(subscriberCount)} người đăng ký`}
                </Typography>
              </div>
            </Box>

            {channelId && channelTitle && (
              <div>
                <SubscribeButton
                  exist={exist}
                  channelId={channelId}
                  channelTitle={channelTitle}
                />
              </div>
            )}
          </Box>

          <Box ml='64px' mt='12px' maxWidth='615px'>
            <div className={`${collapsed ? classes.collapsed : ''}`}>
              {description && <FormattedString str={description} />}
            </div>

            {description && collapsed && (
              <div
                onClick={() => setCollapsed(false)}
                className={classes.buttonMore}
              >
                Hiển thị thêm
              </div>
            )}
          </Box>
        </div>
      </Box>
    </MyContainer>
  );
}
