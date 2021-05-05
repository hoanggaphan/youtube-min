import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { selectPlayListId } from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  fetchNextPlaylistItems,
  selectError,
  selectNextPageToken,
  selectPlaylistItems,
} from 'app/playlistItemsSlice';
import React from 'react';
import VideoItem from './VideoItem';
import VideoItemSkeleton from './VideoItemSkeleton';

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

export default React.memo(function Videos(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const playlistId = useAppSelector(selectPlayListId);
  const playListItems = useAppSelector(selectPlaylistItems);
  const nextPageToken = useAppSelector(selectNextPageToken);
  const error = useAppSelector(selectError);
  const loader = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<any>(null);

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

    observer.current = new IntersectionObserver(handleObserver);

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

  function renderSkeletons(num: number) {
    return [...new Array(num)].map((item, index) => (
      <VideoItemSkeleton key={index} />
    ));
  }
  console.log(1);
  return (
    <Box mb='24px'>
      <div className={classes.grid}>
        {error
          ? error
          : !playListItems.length
          ? renderSkeletons(10)
          : renderList()}
      </div>
      {nextPageToken && (
        <div ref={loader} className={classes.loader}>
          <CircularProgress size={30} />
        </div>
      )}
    </Box>
  );
});
