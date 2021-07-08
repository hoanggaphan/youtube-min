import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  formatDateView,
  formatDuration,
  formatVideoViews,
} from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import { lineClamp } from 'styles/utilities';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
    container: {
      marginTop: '16px',
      display: 'flex',
      columnGap: '16px',

      [theme.breakpoints.down('xs')]: {
        marginTop: '12px',
        columnGap: '10px',
      },
    },
    videoImgContainer: {
      minWidth: '160px',
      maxWidth: '360px',
      backgroundColor: 'rgba(0,0,0,.1)',

      position: 'relative',
      flex: 1,

      '&::before': {
        content: '""',
        display: 'block',
        paddingTop: 'calc((202/360) * 100%)',
      },
    },
    videoImg: {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
    },
    detailContainer: {
      flex: 1,
    },
    videoTitle: {
      ...lineClamp(3),
      fontSize: '14px',
      [theme.breakpoints.up('sm')]: {
        ...lineClamp(2),
        fontSize: '18px',
      },
    },
    videoDes: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        ...lineClamp(2),
      },
    },
    dateViewContainer: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        marginTop: '3px',
      },
    },
    videoViews: {
      fontSize: '12px',
      ...lineClamp(1),
      [theme.breakpoints.up('sm')]: {
        '&::after': {
          content: '"•"',
          margin: '0 4px',
        },
      },
    },
    videoDate: {
      fontSize: '12px',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    videoDuration: {
      margin: '4px',
      padding: '1px 4px',

      position: 'absolute',
      bottom: 0,
      right: 0,
      borderRadius: '2px',

      fontSize: '12px',
      fontWeight: 500,
      color: 'white',
      backgroundColor: 'rgb(19,16,7)',
    },
    channelContainer: {
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      columnGap: '8px',
      order: -1,
      [theme.breakpoints.up('sm')]: {
        padding: '12px 0',
        order: 1,
      },
    },
    channelAvatar: {
      width: '24px',
      height: '24px',
      backgroundColor: 'rgba(0,0,0,.11)',

      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    channelTitle: lineClamp(1),
  })
);

type VideoItemType = gapi.client.youtube.SearchResult & {
  snippet: { viewCount: string; duration: string; channelAvatar: string };
};

export default function VideoItem({
  item,
}: {
  item: VideoItemType;
}): JSX.Element {
  const classes = useStyles();
  return (
    <Link className={classes.link} to={`/video?v=${item.id?.videoId}`}>
      <div className={classes.container}>
        <div className={classes.videoImgContainer}>
          <LazyLoad offset={400} once>
            <img
              src={item.snippet?.thumbnails?.medium?.url}
              alt=''
              width='360'
              className={classes.videoImg}
            />
          </LazyLoad>
          <div className={classes.videoDuration}>
            {/* MOCK START */}
            {/* {formatDuration(item.snippet.duration)} */}
            {formatDuration('PT26M59S')}
            {/* MOCK END */}
          </div>
        </div>
        <div className={classes.detailContainer}>
          <Typography variant='h5' className={classes.videoTitle}>
            {item.snippet?.title}
          </Typography>
          <Box display='flex' flexDirection='column'>
            <div className={classes.dateViewContainer}>
              {/* MOCK START */}
              {/* {item.snippet?.viewCount && (
              <Typography
                className={classes.videoViews}
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {formatVideoViews(item.snippet?.viewCount) + ' lượt xem'}
              </Typography>
            )} */}
              <Typography
                className={classes.videoViews}
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {formatVideoViews(1000000) + ' lượt xem'}
              </Typography>
              {/* MOCK END */}

              <Typography
                className={classes.videoDate}
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {formatDateView(item.snippet?.publishedAt || '')}
              </Typography>
            </div>
            <div className={classes.channelContainer}>
              <Avatar
                // MOCK START
                // src={item?.snippet.channelAvatar}
                src='https://yt3.ggpht.com/ytc/AKedOLQDHzuD5qM6KC54Ya-LVbZMiN8wh1jSx6XNeXssww=s88-c-k-c0x00ffffff-no-rj'
                // MOCK END
                className={classes.channelAvatar}
              >
                {item?.snippet?.channelTitle &&
                  getLastWord(item.snippet.channelTitle).charAt(0)}
              </Avatar>
              <Typography
                variant='caption'
                color='textSecondary'
                className={classes.channelTitle}
              >
                {item.snippet.channelTitle}
              </Typography>
            </div>
          </Box>
          {item.snippet.description && (
            <Typography variant='caption' className={classes.videoDes}>
              {item.snippet.description}
            </Typography>
          )}
        </div>
      </div>
    </Link>
  );
}
