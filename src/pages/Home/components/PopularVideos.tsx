import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as videoAPI from 'api/videoAPI';
import * as channelAPI from 'api/channelAPI';
import { formatDateView, formatVideoViews } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 320px)',
      justifyContent: 'center',
      gap: '40px 16px',
      marginTop: '25px',

      '@media (min-width: 500px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },

      [theme.breakpoints.up('sm')]: {
        marginTop: '50px',
      },

      '@media (min-width: 890px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },

      '@media (min-width: 1144px)': {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    },
    gridImgContainer: {
      position: 'relative',
      '&::before': {
        display: 'block',
        content: "''",
        width: '100%',
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0,0,0,.11)',
      },

      '& img': {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
    title: {
      fontSize: '2.5rem',
      marginTop: '70px',
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.7rem',
      },
    },

    videoTitle: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',

      paddingRight: '24px',
      marginBottom: '6px',
    },

    videoViews: {
      '&::after': {
        content: '"•"',
        margin: '0 4px',
      },
    },

    textEllipsis: {
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    channelAvatar: {
      width: '36px',
      height: '36px',
      backgroundColor: 'rgba(0,0,0,.11)',
    },

    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  })
);

const fetcher = async () => {
  try {
    const resVideo = await videoAPI.fetchVideosPopular();

    // ids for call api to get channel avatar
    const ids = resVideo.result.items?.map(
      (item: gapi.client.youtube.Video) => item.snippet?.channelId!
    )!;

    const resChannel = await channelAPI.fetchChannelById(ids);
    const channelItems = resChannel.result.items!;

    resVideo.result.items?.forEach((vItem: any) => {
      const index = channelItems.findIndex(
        (cItem: gapi.client.youtube.Channel) =>
          cItem.id === vItem.snippet.channelId
      );

      vItem.snippet.channelAvatar =
        channelItems[index].snippet?.thumbnails?.default?.url;
      return vItem;
    });

    return resVideo.result;
  } catch (err) {
    err.result.error.message =
      'An error occurred while fetching videos popular';
    throw err.result.error;
  }
};

export default function PopularVideos(): JSX.Element {
  const classes = useStyles();
  const { data, error } = useSWR('/api/videos?chart=popular', fetcher);

  if (error) {
    return (
      <div>
        <Typography align='center' variant='h2' className={classes.title}>
          Video thịnh hành
        </Typography>
        <div>{error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Typography align='center' variant='h2' className={classes.title}>
          Video thịnh hành
        </Typography>
        <div className={classes.grid}>
          {[...new Array(8)].map((item, index) => (
            <div key={index}>
              <div className={classes.gridImgContainer}></div>
              <Box mt='12px'>
                <Box display='flex' gridColumnGap='12px'>
                  <Skeleton
                    animation={false}
                    variant='circle'
                    width={40}
                    height={40}
                  />

                  <Box flex='1'>
                    <Skeleton animation={false} />
                    <Skeleton animation={false} width='60%' />
                  </Box>
                </Box>
              </Box>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Typography align='center' variant='h2' className={classes.title}>
        Video thịnh hành
      </Typography>
      <div className={classes.grid}>
        {data?.items?.map((item: any) => (
          <Link
            className={classes.link}
            to={`/video?v=${item.id}`}
            key={item.id}
          >
            <div className={classes.gridImgContainer}>
              <img src={item.snippet?.thumbnails?.standard?.url} alt='' />
            </div>
            <Box mt='12px'>
              <Box display='flex' gridColumnGap='12px'>
                <Avatar
                  src={item?.snippet?.channelAvatar}
                  className={classes.channelAvatar}
                >
                  {item?.snippet?.channelTitle &&
                    getLastWord(item.snippet.channelTitle).charAt(0)}
                </Avatar>
                <div>
                  <span
                    className={`${classes.videoTitle} ${classes.textEllipsis}`}
                    title={item.snippet?.title}
                  >
                    {item.snippet?.title}
                  </span>
                  <Typography
                    component='span'
                    variant='body2'
                    color='textSecondary'
                    noWrap
                  >
                    {item.snippet?.channelTitle}
                  </Typography>
                  <Box display='flex' flexWrap='wrap'>
                    <Typography
                      className={classes.videoViews}
                      component='span'
                      variant='body2'
                      color='textSecondary'
                    >
                      {formatVideoViews(item.statistics?.viewCount!) +
                        ' lượt xem'}
                    </Typography>

                    <Typography
                      component='span'
                      variant='body2'
                      color='textSecondary'
                    >
                      {formatDateView(item.snippet?.publishedAt || '')}
                    </Typography>
                  </Box>
                </div>
              </Box>
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
}
