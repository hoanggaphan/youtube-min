import { createStyles, makeStyles, Theme } from '@material-ui/core';
import * as channelAPI from 'api/channelAPI';
import * as searchAPI from 'api/searchAPI';
import * as videoAPI from 'api/videoAPI';
import MyContainer from 'components/MyContainer';
import useQuery from 'hooks/useQuery';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSWRInfinite } from 'swr';
import VideoItem from './components/VideoItem';
import Spinner from 'components/Spinner';
import VideosSkeleton from './components/VideosSkeleton';

const fetchSearchResults = async (
  url: string,
  q: string,
  pageToken?: string
) => {
  try {
    const resSearch = await searchAPI.fetchByKeyword(q, pageToken);
    // ids for call api to get videos views
    const videoIds = resSearch.result.items?.map(
      (item: gapi.client.youtube.SearchResult) => item.id?.videoId!
    )!;
    // fetch videos views
    const resVideos = await videoAPI.fetchVideosViews(videoIds);
    const videosItems = resVideos.result.items!;
    resSearch.result.items?.forEach(
      (pItem: gapi.client.youtube.SearchResult) => {
        const index = videosItems.findIndex(
          (vItem: gapi.client.youtube.Video) => vItem.id === pItem.id?.videoId!
        );
        (pItem as any).snippet.viewCount =
          videosItems[index].statistics?.viewCount;
        (pItem as any).snippet.duration =
          videosItems[index].contentDetails?.duration;
        return pItem;
      }
    );
    // ids for call api to get channel avatar
    const channelIds = resSearch.result.items?.map(
      (item: gapi.client.youtube.SearchResult) => item.snippet?.channelId!
    )!;
    // fetch channel avatar
    const resChannel = await channelAPI.fetchChannelById(channelIds);
    const channelItems = resChannel.result.items!;
    resSearch.result.items?.forEach(
      (pItem: gapi.client.youtube.SearchResult) => {
        const index = channelItems.findIndex(
          (vItem: gapi.client.youtube.Channel) =>
            vItem.id === pItem.snippet?.channelId
        );
        (pItem as any).snippet.channelAvatar =
          channelItems[index].snippet?.thumbnails?.default?.url;
        return pItem;
      }
    );
    return resSearch.result;
  } catch (err) {
    if (err.message) {
      throw err;
    }
    if (err.result.error.message) {
      throw err.result.error;
    }
    err.result.error.message = 'An error occurred while fetching channel';
    throw err.result.error;
  }
};

const fetchDataTest = async () => {
  const res = await fetch('https://testapi.io/api/hoanggaphan/search');
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

  const loader = React.useRef<HTMLDivElement | null>(null);
  const observerLoader = React.useRef<any>(null);
  const isLoading = React.useRef(false);

  const q = query.get('search_query');

  const { data, error, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // reached the end
      if (previousPageData && !previousPageData.nextPageToken) return null;

      // first page, we don't have `previousPageData`
      if (pageIndex === 0) return [`/results`, q];

      // add the cursor to the API endpoint
      return [
        `/results?token=${previousPageData?.nextPageToken}`,
        q,
        previousPageData?.nextPageToken,
      ];
    },
    fetchSearchResults
  );
  
  React.useEffect(() => {
    document.title = q + ' - Youtube' || '';
    // eslint-disable-next-line
  }, []);

  // Lazy Load More Results
  React.useEffect(() => {
    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        try {
          if (isLoading.current) return;
          isLoading.current = true;
          await setSize((size) => size + 1);
        } finally {
          isLoading.current = false;
        }
      }
    };

    if (observerLoader.current) observerLoader.current.disconnect();

    observerLoader.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 430px 0px',
    });

    if (loader.current) observerLoader.current.observe(loader.current);

    return () => observerLoader.current.disconnect();
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

  const renderList = () => {
    return data?.map((video, index) => (
      <div key={index}>
        {video.items?.map((item: any) => (
          <VideoItem key={item.id?.videoId} item={item} />
        ))}
      </div>
    ));
  };

  return (
    <div className={classes.container}>
      <MyContainer>
        {data ? renderList() : <VideosSkeleton num={10} />}
        <div
          ref={loader}
          className={`${
            (!data || !data[data.length - 1].nextPageToken) && classes.none
          } ${classes.loader}`}
        >
          <Spinner />
        </div>
      </MyContainer>
    </div>
  );
}
