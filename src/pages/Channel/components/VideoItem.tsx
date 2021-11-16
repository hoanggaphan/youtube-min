import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  formatDateView,
  formatDuration,
  formatVideoViews,
} from 'helpers/format';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: 'unset',
      position: 'relative',

      '& .interaction': {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        pointerEvents: 'none',
        margin: '-4px',
        borderRadius: '4px',
      },

      '& .interaction-fill': {
        backgroundColor: '#000',
        opacity: '0',
        transition: 'opacity .2s',
      },
      '&:active .interaction-fill': {
        opacity: '.1',
        transition: 'opacity 0s',
      },
    },
    gridItem: {
      position: 'relative',
      backgroundColor: 'rgba(0,0,0,.1)',

      '&::before': {
        content: "''",
        display: 'block',
        paddingTop: '56.25%',
      },
    },
    img: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
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
  })
);

export default function VideoItem({ item }: { item: any }): JSX.Element {
  const classes = useStyles();

  /**
   * Check video is deleted but
   * not updated via api
   */
  if (
    item.snippet.title === 'Deleted video' &&
    Object.keys(item.snippet.thumbnails).length === 0
  )
    return <></>;

  return (
    <Link
      to={`/video?v=${item.contentDetails.videoId}`}
      key={item.id}
      className={classes.link}
    >
      <div className={classes.gridItem}>
        <img
          className={classes.img}
          src={item.snippet.thumbnails.medium?.url}
          alt=''
        />
        <div className={classes.duration}>
          {formatDuration(item.snippet.duration)}
        </div>
      </div>
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
      <div className='interaction interaction-fill'></div>
    </Link>
  );
}
