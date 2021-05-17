import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  formatDateView,
  formatDuration,
  formatVideoViews,
} from 'helpers/format';
import React from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridItem: {
      textDecoration: 'none',
      color: 'unset',
    },
    title: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1,
      margin: '8px 0',
      paddingRight: '24px',
    },
    textEllipsis: {
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    views: {
      fontSize: '13px',

      '&::after': {
        content: '"•"',
        margin: '0 4px',
      },
    },
    date: {
      fontSize: '13px',
    },
    duration: {
      color: 'white',
      fontWeight: 500,
      fontSize: '12px',
    },
  })
);

export default function VideoItem({ item }: { item: any }): JSX.Element {
  const classes = useStyles();

  return (
    <Link
      to={`/video?v=${item.contentDetails.videoId}`}
      key={item.id}
      className={classes.gridItem}
    >
      <Box position='relative'>
        <LazyLoad height={118} offset={400} once>
          <img
            src={item.snippet.thumbnails.medium.url}
            alt=''
            width='210'
            height='118'
          />
        </LazyLoad>
        <Box
          bgcolor='rgb(19,16,7)'
          borderRadius='2px'
          position='absolute'
          bottom='0'
          right='0'
          m='4px'
          p='3px 4px'
          lineHeight='12px'
        >
          <Typography className={classes.duration} component='span'>
            {formatDuration(item.snippet.duration)}
          </Typography>
        </Box>
      </Box>
      <h3
        className={`${classes.title} ${classes.textEllipsis}`}
        title={item.snippet.title}
      >
        {item.snippet.title}
      </h3>
      <div>
        <Typography
          className={classes.views}
          component='span'
          variant='body2'
          color='textSecondary'
        >
          {formatVideoViews(item.snippet.viewCount) + ' lượt xem'}
        </Typography>
        <Typography
          className={classes.date}
          component='span'
          variant='body2'
          color='textSecondary'
        >
          {formatDateView(item.contentDetails.videoPublishedAt)}
        </Typography>
      </div>
    </Link>
  );
}
