import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as commentAPI from 'api/commentAPI';
import Spinner from 'components/Spinner';
import { useSnackbar } from 'notistack';
import React from 'react';
import CommentHeader from './CommentHeader';
import CommentItem from './CommentItem';
import CommentPost from './CommentPost';
import InfiniteScroll from 'components/InfiniteScroll';
import useIsMounted from 'hooks/useIsMounted';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    loader: {
      display: 'inline-block',
      width: '100%',
      textAlign: 'center',
      marginTop: '24px',
    },
    sortingLoader: {
      position: 'absolute',
      left: '50%',
      top: '250px',
      transform: 'translateX(-50%)',
    },
    opacity: {
      opacity: '.25',
    },
    link: {
      textDecoration: 'none',
      color: 'rgb(6, 95, 212)',
    },
  });
});

type State = {
  data: undefined | gapi.client.youtube.CommentThreadListResponse[];
  err: any;
  isSorting: boolean;
  index: number;
};

type Action =
  | {
      type: 'FETCH_PENDING';
    }
  | {
      type: 'FETCH_FULFILLED';
      payload: gapi.client.youtube.CommentThreadListResponse;
    }
  | { type: 'FETCH_REJECTED'; err: any }
  | { type: 'SORT_PENDING' }
  | {
      type: 'SORT_FULFILLED';
      payload: gapi.client.youtube.CommentThreadListResponse;
    }
  | {
      type: 'SORT_REJECTED';
    }
  | {
      type: 'ADD_FULFILLED';
      payload: gapi.client.youtube.CommentThreadListResponse[];
    }
  | {
      type: 'SET_INDEX';
      index: number;
    };

const initialState: State = {
  data: undefined,
  err: undefined,
  isSorting: false,
  index: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_FULFILLED':
      if (!state.data) return { ...state, data: [action.payload] };
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case 'FETCH_REJECTED':
      return { ...state, err: action.err };
    case 'SORT_PENDING':
      return { ...state, isSorting: true };
    case 'SORT_FULFILLED':
      return { ...state, isSorting: false, data: [action.payload] };
    case 'SORT_REJECTED':
      return { ...state, isSorting: false };
    case 'ADD_FULFILLED':
      return { ...state, data: action.payload };
    case 'SET_INDEX':
      return { ...state, index: action.index };
    default:
      return state;
  }
}

export const CommentContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default React.memo(function Comments({
  videoId,
  channelId,
  player,
}: {
  videoId: string;
  channelId: string;
  player?: any;
}) {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { data, err, isSorting, index } = state;

  React.useEffect(() => {
    isMounted() &&
      commentAPI
        .fetchListByVideoId(videoId)
        .then((res) =>
          dispatch({ type: 'FETCH_FULFILLED', payload: res.result })
        )
        .catch((err) =>
          dispatch({ type: 'FETCH_REJECTED', err: err.result.error })
        );
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    if (!data) return;
    try {
      const res = await commentAPI.fetchListByVideoId(
        videoId,
        data[data?.length - 1].nextPageToken,
        50,
        index === 0 ? 'relevance' : 'time'
      );
      dispatch({ type: 'FETCH_FULFILLED', payload: res.result });
    } catch (err) {
      enqueueSnackbar('An error occurred while fetching next comment', {
        variant: 'error',
      });
      dispatch({ type: 'FETCH_REJECTED', err: undefined });
    }
  };

  if (err) {
    if (err.code === 403 && err.errors[0].reason === 'commentsDisabled') {
      return (
        <Box mt='24px' textAlign='center'>
          Tính năng bình luận đã bị tắt.
          <a
            className={classes.link}
            href='https://support.google.com/youtube/answer/9706180?hl=vi'
            target='__blank'
            rel='noopener noreferrer nofollow'
          >
            Tìm hiểu thêm
          </a>
        </Box>
      );
    }

    return <>{err.message}</>;
  }

  if (!data)
    return (
      <div className={classes.loader}>
        <Spinner />
      </div>
    );

  return (
    <CommentContext.Provider value={{ state, dispatch }}>
      <Box position='relative'>
        <div className={`${isSorting ? classes.opacity : ''}`}>
          <CommentHeader />

          <CommentPost videoId={videoId} channelId={channelId} />

          <InfiniteScroll
            next={fetchMoreData}
            hasMore={!!data[data.length - 1].nextPageToken}
            loader={
              <div className={classes.loader}>
                <Spinner />
              </div>
            }
          >
            {data.map((comment, index) => (
              <div key={index}>
                {comment.items?.map(
                  (item: gapi.client.youtube.CommentThread) => (
                    <CommentItem key={item.id} item={item} player={player} />
                  )
                )}
              </div>
            ))}
          </InfiniteScroll>
        </div>

        {isSorting && (
          <div className={classes.sortingLoader}>
            <Spinner />
          </div>
        )}
      </Box>
    </CommentContext.Provider>
  );
});
