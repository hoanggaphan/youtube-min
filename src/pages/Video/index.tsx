import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Skeleton from '@material-ui/lab/Skeleton';
import useChannel from 'app/useChannel';
import useVideo from 'app/useVideo';
import FormattedString from 'components/FormattedString';
import MyContainer from 'components/MyContainer';
import StyledTooltip from 'components/StyledTooltip';
import SubscribeButton from 'components/SubscribeButton';
import { formatNumberWithDots, formatSubscriptionCount } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import useIframeAPI from 'hooks/useIframeAPI';
import useQuery from 'hooks/useQuery';
import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Collapsed from './components/Collapsed';
import Comment from './components/Comment';
import LikeDisLike from './components/LikeDisLike';
import ViewDate from './components/ViewDate';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    iframeWrapperPadding: {
      paddingTop: '12px',
      [theme.breakpoints.up('sm')]: {
        paddingTop: '24px',
      },
    },
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
    likeDislikeContainer: {
      marginTop: '5px',
      [theme.breakpoints.up('sm')]: {
        marginTop: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
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
      marginBottom: '24px',
    },
    avatar: {
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(0,0,0,.11)',
    },
    textDecoration: {
      textDecoration: 'none',
    },
  });
});

const calculatePercent = (likeNum: number, disLikeNum: number) => {
  if (likeNum === 0 && disLikeNum === 0) return 50;
  return (likeNum / (likeNum + disLikeNum)) * 100;
};

export default function Video(): JSX.Element {
  const classes = useStyles();
  const { player } = useIframeAPI('ytb-player');
  const query = useQuery();

  const videoId = query.get('v') || '';
  const start = query.get('t') || '';

  const {
    data: videoData,
    error: videoError,
    isLoading: videoIsValidating,
  } = useVideo(videoId);
  const videoTitle = videoData?.snippet?.title;
  const description = videoData?.snippet?.description;
  const likeCount = videoData?.statistics?.likeCount;
  const dislikeCount = videoData?.statistics?.dislikeCount;
  const channelId = videoData?.snippet?.channelId;

  const {
    data: channelData,
    error: channelError,
    isLoading: channelIsValidating,
  } = useChannel(channelId);

  React.useEffect(() => {
    document.title = videoTitle + ' - Mini YouTube';
  }, [videoTitle]);

  if (!videoId) {
    return <Redirect to='/' />;
  }

  if (channelError) {
    return <MyContainer>{channelError.message}</MyContainer>;
  }

  if (videoError) {
    return <MyContainer>{videoError.message}</MyContainer>;
  }

  if (
    !videoIsValidating &&
    !channelIsValidating &&
    !videoData &&
    !channelData
  ) {
    return (
      <div className={classes.iframeWrapperPadding}>
        <div className={classes.iframeContainer}>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            className={classes.iframe}
          >
            <ErrorOutlineIcon className={classes.iframeIconError} />
            <span className={classes.iframeTextError}>Video không có sẵn</span>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <Box mb='50px'>
      <div className={classes.iframeWrapperPadding}>
        <div className={classes.iframeContainer}>
          <iframe
            id='ytb-player'
            className={classes.iframe}
            title='Youtube video player'
            src={`https://www.youtube.com/embed/${videoId}${
              start && '&start=' + start
            }`}
            allow='autoplay'
            frameBorder='0'
            allowFullScreen
          />
        </div>
      </div>

      <div>
        {!videoData ? (
          <Box p='20px 0 8px 0'>
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
          </Box>
        ) : (
          <Box p='20px 0 8px 0'>
            <Typography variant='h5' className={classes.title}>
              {videoTitle}
            </Typography>
            <div className={classes.likeDislikeContainer}>
              {videoData && <ViewDate videoData={videoData} />}

              <Box position='relative' display='inline-block'>
                {videoData && <LikeDisLike videoData={videoData} />}

                {likeCount && dislikeCount && (
                  <StyledTooltip
                    title={
                      <span className={classes.tooltipText}>
                        {formatNumberWithDots(likeCount)} /{' '}
                        {formatNumberWithDots(dislikeCount)}
                      </span>
                    }
                    placement='top'
                  >
                    <Box
                      width='100%'
                      pt='6px'
                      pb='24px'
                      position='absolute'
                      left='0'
                    >
                      <Box height='2px' bgcolor='#737373'>
                        <Box
                          height='2px'
                          width={`${calculatePercent(
                            +likeCount,
                            +dislikeCount
                          )}%`}
                          bgcolor='#030303'
                        />
                      </Box>
                    </Box>
                  </StyledTooltip>
                )}
              </Box>
            </div>
          </Box>
        )}

        {!channelData ? (
          <div className={classes.metaContainer}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box display='flex' flex='1' alignItems='center'>
                <Box mr='16px'>
                  <Skeleton
                    animation={false}
                    variant='circle'
                    className={classes.avatar}
                  />
                </Box>

                <Box width='100%'>
                  <Skeleton animation={false} width='50%' />
                  <Skeleton animation={false} width='30%' />
                </Box>
              </Box>

              <Skeleton animation={false} height='50px' width='100px' />
            </Box>
          </div>
        ) : (
          <div className={classes.metaContainer}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              minHeight='50px'
            >
              <Box display='flex' flex='1' alignItems='center'>
                <Box mr='16px'>
                  <Link to={`/channel/${channelId}`}>
                    <Avatar
                      src={channelData?.snippet?.thumbnails?.default?.url}
                      className={classes.avatar}
                    >
                      {channelData?.snippet?.title &&
                        getLastWord(channelData.snippet.title).charAt(0)}
                    </Avatar>
                  </Link>
                </Box>

                <div>
                  <StyledTooltip
                    title={channelData?.snippet?.title}
                    placement='top'
                  >
                    <Typography
                      className={classes.textDecoration}
                      variant='subtitle2'
                      display='block'
                      component={Link}
                      to={`/channel/${channelId}`}
                      color='inherit'
                    >
                      {channelData?.snippet?.title}
                    </Typography>
                  </StyledTooltip>
                  <Typography variant='caption'>
                    {channelData?.statistics?.subscriberCount &&
                      `${formatSubscriptionCount(
                        channelData.statistics.subscriberCount
                      )} người đăng ký`}
                  </Typography>
                </div>
              </Box>

              <div>
                <SubscribeButton
                  channelId={channelId!}
                  channelTitle={channelData?.snippet?.title!}
                />
              </div>
            </Box>

            {description && (
              <Box ml='64px' mt='12px' maxWidth='615px'>
                <Collapsed height={60} showBtnCol>
                  <FormattedString str={description} player={player} />
                </Collapsed>
              </Box>
            )}
          </div>
        )}

        <Comment videoId={videoId} player={player} />
      </div>
    </Box>
  );
}
