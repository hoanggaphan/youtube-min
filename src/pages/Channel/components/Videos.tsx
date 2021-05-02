import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { selectChannelId, selectPlayListId } from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  fetchNextPlayListItems,
  fetchPlayListItems,
  selectPlayListItems,
} from 'app/playListItemsSlice';
import React from 'react';
import VideoItem from './VideoItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: '210px',
      gap: '24px 4px',
      justifyContent: 'center',

      '@media only screen and (min-width: 428px)': {
        gridTemplateColumns: 'repeat(2, 210px)',
      },
      '@media only screen and (min-width: 642px)': {
        gridTemplateColumns: 'repeat(3, 210px)',
      },
      '@media only screen and (min-width: 856px)': {
        gridTemplateColumns: 'repeat(4, 210px)',
      },
      '@media only screen and (min-width: 1070px)': {
        gridTemplateColumns: 'repeat(5, 210px)',
      },
    },

    loader: {
      margin: '24px auto 0',
      width: 'fit-content',
    },
  })
);

export default React.memo(function Videos(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const playListId = useAppSelector(selectPlayListId) || '';
  const channelId = useAppSelector(selectChannelId) || '';
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
        {!currentPlayListItems
          ? 'Loading...'
          : currentPlayListItems.items.map((item: any) => (
              <VideoItem key={item.id} item={item} />
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
