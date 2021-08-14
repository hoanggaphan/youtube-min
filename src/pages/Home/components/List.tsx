import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { videosState } from 'app/useVideos';
import { formatDateView, formatVideoViews } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 320px)',
      justifyContent: 'center',
      gap: '40px 16px',
      marginTop: '25px',

      '@media (min-width: 500px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },

      [theme.breakpoints.up('sm')]: {
        marginTop: '50px',
      },

      '@media (min-width: 890px)': {
        gridTemplateColumns: 'repeat(3,  minmax(0, 1fr))',
      },

      '@media (min-width: 1144px)': {
        gridTemplateColumns: 'repeat(4,  minmax(0, 1fr))',
      },
    },
    gridImgContainer: {
      position: 'relative',
      '&::before': {
        display: 'block',
        content: "''",
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

export default function List({
  title,
  result,
  skeletons,
}: {
  title: string;
  result: videosState;
  skeletons: number;
}): JSX.Element {
  const classes = useStyles();
  const { data, error } = result;

  if (error) {
    return (
      <div>
        <Typography align='center' variant='h2' className={classes.title}>
          {title}
        </Typography>
        <div>{error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Typography align='center' variant='h2' className={classes.title}>
          {title}
        </Typography>
        <div className={classes.grid}>
          {[...new Array(skeletons)].map((item, index) => (
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
        {title}
      </Typography>
      {data.items?.length ? (
        <div className={classes.grid}>
          {data?.items?.map((item: any) => (
            <Link
              className={classes.link}
              to={`/video?v=${item.id}`}
              key={item.id}
            >
              <div className={classes.gridImgContainer}>
                <img src={item.snippet?.thumbnails?.medium?.url} alt='' />
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
      ) : (
        <div>Không có video nào</div>
      )}
    </div>
  );
}
