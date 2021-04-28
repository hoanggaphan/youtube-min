import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { selectChannelId, selectPlayListId } from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  fetchNextPlayListItems,
  fetchPlayListItems,
  selectPlayListItems,
} from 'app/playListItemsSlice';
import {
  formatDateView,
  formatDuration,
  formatVideoViews,
} from 'helpers/format';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: '0 auto',

      maxWidth: '214px',
      '@media only screen and (min-width: 428px)': {
        maxWidth: '428px',
      },
      '@media only screen and (min-width: 642px)': {
        maxWidth: '642px',
      },
      '@media only screen and (min-width: 856px)': {
        maxWidth: '856px',
      },
      '@media only screen and (min-width: 1070px)': {
        maxWidth: '1070px',
      },
    },
    gridItem: {
      width: '210px',
      marginRight: '4px',
      marginBottom: '24px',
      textDecoration: 'none',
      color: 'unset',
    },
    title: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1,
      margin: '8px 0',
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
    loader: {
      margin: '0 auto',
      width: 'fit-content',
    },
  })
);

export default React.memo(function Videos(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const playListId = useAppSelector(selectPlayListId);
  const channelId = useAppSelector(selectChannelId);
  const playListItems = useAppSelector(selectPlayListItems);
  const loader = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<any>(null);
  
  const currentPlayListItems = playListItems.find(
    (item: any) => item.channelId === channelId
  );

  React.useEffect(() => {
    if (!playListId) return;
    if (currentPlayListItems) return;
    dispatch(fetchPlayListItems({ playListId, channelId }));
    // eslint-disable-next-line
  }, [playListId]);

  React.useEffect(() => {
    if (!currentPlayListItems?.items.length) return;

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
      const target = entities[0];
      if (target.isIntersecting) {
        dispatch(
          fetchNextPlayListItems({
            playListId,
            channelId,
            nextPageToken: currentPlayListItems.nextPageToken,
          })
        );
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver);

    if (loader.current) {
      observer.current.observe(loader.current);
    }

    return () => observer.current.disconnect();
    // eslint-disable-next-line
  }, [playListItems]);

  return (
    <Box mb='24px'>
      <div className={classes.grid}>
        {currentPlayListItems?.items.map((item: any) => (
          <Link
            to={`/video/${item.id}`}
            key={item.id}
            className={classes.gridItem}
          >
            <Box position='relative' width='210' height='118'>
              <img
                src={item.snippet.thumbnails.medium.url}
                alt={item.snippet.title}
                width='210'
                height='118'
                loading='lazy'
              />
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
            <div className=''>
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
        ))}
      </div>
      {currentPlayListItems?.nextPageToken &&
        currentPlayListItems?.items.length > 0 && (
          <div ref={loader} className={classes.loader}>
            <CircularProgress />
          </div>
        )}
    </Box>
  );
});
