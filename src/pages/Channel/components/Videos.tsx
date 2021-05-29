import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  fetchNextPlaylistItems,
  selectNextPageToken,
  selectPlaylistItems,
  selectPlaylistItemsError,
} from 'app/playlistItemsSlice';
import React from 'react';
import VideoItem from './VideoItem';
import VideosSkeleton from './VideosSkeleton';

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

    mt24: {
      marginTop: '24px',
    },
  })
);

export default React.memo(function Videos({
  channelData,
}: {
  channelData: null | gapi.client.youtube.Channel;
}): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const loader = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<any>(null);

  const playListItems = useAppSelector(selectPlaylistItems);
  const nextPageToken = useAppSelector(selectNextPageToken);
  const error = useAppSelector(selectPlaylistItemsError);

  const playlistId = channelData?.contentDetails?.relatedPlaylists?.uploads;

  React.useEffect(() => {
    if (!nextPageToken || !playlistId) return;

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        dispatch(
          fetchNextPlaylistItems({
            playlistId,
            nextPageToken,
          })
        );
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 400px 0px',
    });

    if (loader.current) {
      observer.current.observe(loader.current);
    }

    return () => observer.current.disconnect();
    // eslint-disable-next-line
  }, [nextPageToken, playlistId]);

  function renderList() {
    return playListItems.map((item: any) => (
      <VideoItem key={item.id} item={item} />
    ));
  }

  return (
    <Box mb='24px'>
      {error ? (
        <Box textAlign='center'>{error}</Box>
      ) : !playListItems.length ? (
        <div className={classes.grid}>
          <VideosSkeleton num={10} />
        </div>
      ) : (
        <div className={classes.grid}>{renderList()}</div>
      )}
      {nextPageToken && (
        <div ref={loader} className={classes.loader}>
          <CircularProgress size={30} />
        </div>
      )}
    </Box>
  );
});
