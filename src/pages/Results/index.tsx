import { createStyles, makeStyles, Theme } from '@material-ui/core';
import MyContainer from 'components/MyContainer';
import Spinner from 'components/Spinner';
import useQuery from 'hooks/useQuery';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSWRInfinite } from 'swr';
import VideoItem from './components/VideoItem';
import VideosSkeleton from './components/VideosSkeleton';
import InfiniteScroll from 'components/InfiniteScroll';
import { useSnackbar } from 'notistack';

const mockData = async () => {
  const res = await fetch(
    'https://run.mocky.io/v3/030d5b4c-9d1f-42d6-80da-53bea13184fe'
  );
  const result = res.json();
  return result;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '0 12px',
      [theme.breakpoints.up('sm')]: {
        padding: '0 24px',
      },
    },
    loader: {
      display: 'inline-block',
      textAlign: 'center',
      width: '100%',
      margin: '30px',
    },
    none: {
      display: 'none',
    },
  })
);

export default function Results(): JSX.Element {
  const classes = useStyles();
  const query = useQuery();
  const q = query.get('search_query');
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPageToken) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return [`/api/results`, q];

      // add the cursor to the API endpoint
      return [`/api/results`, q, previousPageData?.nextPageToken];
    },
    mockData
  );

  React.useEffect(() => {
    document.title = q + ' - Youtube' || '';
    // eslint-disable-next-line
  }, []);

  if (!q) {
    return <Redirect to='/home' />;
  }

  if (error) {
    if (error.code === 403 && error.errors[0].reason === 'quotaExceeded') {
      return (
        <MyContainer>
          The request cannot be completed because you have exceeded your{' '}
          <a
            href='https://developers.google.com/youtube/v3/getting-started#quota'
            rel='noopener noreferrer nofollow'
            target='__blank'
          >
            quota
          </a>
          .
        </MyContainer>
      );
    }
    return <MyContainer>{error.message}</MyContainer>;
  }

  const fetchMoreData = async () => {
    try {
      await setSize((size) => size + 1);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <div className={classes.container}>
      <MyContainer>
        {data ? (
          <InfiniteScroll
            next={fetchMoreData}
            hasMore={!!data[data.length - 1].nextPageToken}
            loader={
              <div className={classes.loader}>
                <Spinner />
              </div>
            }
            options={{
              rootMargin: '0px 0px 430px 0px',
            }}
          >
            {data?.map((video, index) => (
              <div key={index}>
                {video.items?.map((item: any) => (
                  <VideoItem key={item.id?.videoId} item={item} />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <VideosSkeleton num={10} />
        )}
      </MyContainer>
    </div>
  );
}
