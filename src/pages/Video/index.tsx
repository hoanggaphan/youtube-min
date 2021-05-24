import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  fetchChannelById,
  resetChannel,
  selectChannelSubscriberCount,
  selectChannelThumbUrl,
  selectChannelTitle,
  selectLoading,
} from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { checkSubscriptionExist, selectExist } from 'app/subscriptionSlice';
import {
  fetchVideoById,
  selectChannelId,
  selectVideoDescription,
  selectVideoDislikeCount,
  selectVideoLikeCount,
  selectVideoLoading,
  selectVideoTitle,
} from 'app/videoSlice';
import FormattedString from 'components/FormattedString';
import MyContainer from 'components/MyContainer';
import SubscribeButton from 'components/SubscribeButton';
import { formatNumberWithDots, formatSubscriptionCount } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import useIframeAPI from 'hooks/useIframeAPI';
import useQuery from 'hooks/useQuery';
import React from 'react';
import { Redirect } from 'react-router';
import Collapsed from './components/Collapsed';
import Comments from './components/Comments';
import LikeDisLike from './components/LikeDisLike';
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
    title: {
      fontSize: '18px',
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
  });
});

export default function Video(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const videoId = query.get('v') || '';
  const start = query.get('t') || '';
  const videoTitle = useAppSelector(selectVideoTitle);
  const likeCount = useAppSelector(selectVideoLikeCount);
  const dislikeCount = useAppSelector(selectVideoDislikeCount);
  const description = useAppSelector(selectVideoDescription);
  const avatarChannel = useAppSelector(selectChannelThumbUrl);
  const channelId = useAppSelector(selectChannelId);
  const channelTitle = useAppSelector(selectChannelTitle);
  const subscriberCount = useAppSelector(selectChannelSubscriberCount);
  const exist = useAppSelector(selectExist);
  const videoLoading = useAppSelector(selectVideoLoading);
  const channelLoading = useAppSelector(selectLoading);
  const { player } = useIframeAPI('ytb-player');

  React.useEffect(() => {
    dispatch(fetchVideoById(videoId));
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

  if (!videoId) {
    return <Redirect to='/home' />;
  }

  return (
    <MyContainer>
      <Box p='24px'>
        {videoLoading === 'failed' ? (
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
            <iframe
              id='ytb-player'
              className={classes.iframe}
              title='Youtube video player'
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1${
                start && '&start=' + start
              }`}
              allow='autoplay'
              frameBorder='0'
              allowFullScreen
            />
          </div>
        )}

        {videoLoading === 'failed' ? null : (
          <Box p='20px 0 8px 0'>
            {videoLoading === 'succeeded' ? (
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
                    <LikeDisLike />
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
                <Skeleton animation={false} width='50%' height='34px' />
                <Box width='100%' display='flex' justifyContent='space-between'>
                  <Skeleton animation={false} width='30%' height='34px' />

                  <Box display='flex' alignItems='center'>
                    <Box mx='8px'>
                      <Skeleton
                        animation={false}
                        variant='circle'
                        width='20px'
                        height='20px'
                      />
                    </Box>
                    <Box mx='8px'>
                      <Skeleton
                        animation={false}
                        variant='circle'
                        width='20px'
                        height='20px'
                      />
                    </Box>
                    <Box mx='8px'>
                      <Skeleton
                        animation={false}
                        variant='circle'
                        width='20px'
                        height='20px'
                      />
                    </Box>
                    <Box mx='8px'>
                      <Skeleton
                        animation={false}
                        variant='circle'
                        width='20px'
                        height='20px'
                      />
                    </Box>
                    <Box mx='8px'>
                      <Skeleton
                        animation={false}
                        variant='circle'
                        width='20px'
                        height='20px'
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}

        {videoLoading === 'succeeded' && (
          <div className={classes.metaContainer}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box display='flex' flex='1' alignItems='center'>
                {channelLoading === 'succeeded' ? (
                  <Avatar src={avatarChannel} className={classes.avatar}>
                    {channelTitle && getLastWord(channelTitle).charAt(0)}
                  </Avatar>
                ) : (
                  <Skeleton
                    animation={false}
                    variant='circle'
                    className={classes.avatar}
                  />
                )}

                {channelLoading === 'succeeded' ? (
                  <div>
                    <Typography variant='subtitle2'>
                      {channelTitle && channelTitle}
                    </Typography>
                    <Typography variant='caption'>
                      {subscriberCount &&
                        `${formatSubscriptionCount(
                          subscriberCount
                        )} người đăng ký`}
                    </Typography>
                  </div>
                ) : (
                  <Box width='100%'>
                    <Skeleton animation={false} width='50%' />
                    <Skeleton animation={false} width='30%' />
                  </Box>
                )}
              </Box>

              {channelLoading === 'succeeded' && channelId && channelTitle ? (
                <div>
                  <SubscribeButton
                    exist={exist}
                    channelId={channelId}
                    channelTitle={channelTitle}
                  />
                </div>
              ) : (
                <Skeleton animation={false} height='50px' width='100px' />
              )}
            </Box>

            {description && channelLoading === 'succeeded' && (
              <Box ml='64px' mt='12px' maxWidth='615px'>
                <Collapsed height={60}>
                  <FormattedString str={description} player={player} />
                </Collapsed>
              </Box>
            )}
          </div>
        )}

        {videoLoading === 'succeeded' && channelId && (
          <Comments videoId={videoId} channelId={channelId} player={player} />
        )}
      </Box>
    </MyContainer>
  );
}
