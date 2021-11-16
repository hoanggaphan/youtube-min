import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import useVideos from 'app/useVideos';
import StyledTooltip from 'components/StyledTooltip';
import { formatDateView, formatVideoViews } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 320px)',
      justifyContent: 'center',
      gap: '40px 16px',

      '@media (min-width: 500px)': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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

    channelTitle: {
      transition: '.1s',

      '&:hover': {
        color: theme.palette.grey['700'],
      },
    },

    link: {
      textDecoration: 'none',
      color: 'inherit',
      alignSelf: 'flex-start',
    },

    item: {
      cursor: 'pointer',
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
  })
);

export default function List({
  title,
  request,
  skeletons,
}: {
  title: String;
  request: () => gapi.client.Request<gapi.client.youtube.VideoListResponse>;
  skeletons: number;
}): JSX.Element {
  const classes = useStyles();
  const { data, error } = useVideos(`popular=${title}`, request);
  const history = useHistory();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return (
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
    );
  }

  if (!data.items?.length) {
    return <div>Không có video nào</div>;
  }

  return (
    <div className={classes.grid}>
      {data?.items?.map((item: any) => (
        <Box
          onClick={() => {
            history.push(`/video?v=${item.id}`);
          }}
          key={item.id}
          className={`${classes.item} `}
        >
          <div className={classes.gridImgContainer}>
            <img src={item.snippet?.thumbnails?.medium?.url} alt='' />
          </div>
          <Box mt='12px'>
            <Box display='flex' gridColumnGap='12px'>
              <Link
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  history.push(`/channel/${item?.snippet?.channelId}`);
                }}
                to={`/channel/${item?.snippet?.channelId}`}
                title={item.snippet?.channelTitle}
                className={classes.link}
              >
                <Avatar
                  src={item?.snippet?.channelAvatar}
                  className={classes.channelAvatar}
                >
                  {item?.snippet?.channelTitle &&
                    getLastWord(item.snippet.channelTitle).charAt(0)}
                </Avatar>
              </Link>

              <div>
                <span
                  className={`${classes.videoTitle} ${classes.textEllipsis}`}
                  title={item.snippet?.title}
                >
                  {item.snippet?.title}
                </span>

                <StyledTooltip
                  title={item.snippet?.channelTitle}
                  placement='top'
                >
                  <Link
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      history.push(`/channel/${item?.snippet?.channelId}`);
                    }}
                    to={`/channel/${item?.snippet?.channelId}`}
                    className={classes.link}
                  >
                    <Typography
                      component='span'
                      variant='body2'
                      color='textSecondary'
                      className={classes.channelTitle}
                    >
                      {item.snippet?.channelTitle}
                    </Typography>
                  </Link>
                </StyledTooltip>

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
          <div className='interaction interaction-fill'></div>
        </Box>
      ))}
    </div>
  );
}
