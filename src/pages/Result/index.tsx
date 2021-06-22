import { createStyles, makeStyles, Theme } from '@material-ui/core';
import * as channelAPI from 'api/channelAPI';
import * as searchAPI from 'api/searchAPI';
import * as videoAPI from 'api/videoAPI';
import MyContainer from 'components/MyContainer';
import useQuery from 'hooks/useQuery';
import React from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';
import VideoItem from './components/VideoItem';
import VideosSkeleton from './components/VideosSkeleton';
import data from 'test/data.json';

const fetchSearchResult = async (url: string, q: string) => {
  try {
    const resResult = await searchAPI.fetchByKeyword(q);

    // ids for call api to get videos views
    const videoIds = resResult.result.items?.map(
      (item: gapi.client.youtube.SearchResult) => item.id?.videoId!
    )!;
    // fetch videos views
    const resVideos = await videoAPI.fetchVideosViews(videoIds);
    const videosItems = resVideos.result.items!;

    resResult.result.items?.forEach(
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
    const channelIds = resResult.result.items?.map(
      (item: gapi.client.youtube.SearchResult) => item.snippet?.channelId!
    )!;
    // fetch channel avatar
    const resChannel = await channelAPI.fetchChannelById(channelIds);
    const channelItems = resChannel.result.items!;

    resResult.result.items?.forEach(
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

    return resResult.result;
    // return (await new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve(data);
    //   }, 1000)
    // )) as any;
  } catch (err) {
    if (err.message) {
      throw err;
    }
    err.result.error.message = 'An error occurred while fetching channel';
    throw err.result.error;
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '0 12px',
      [theme.breakpoints.up('sm')]: {
        padding: '0 24px',
      },
    },
  })
);

export default function Result(): JSX.Element {
  const classes = useStyles();
  const query = useQuery();
  const q = query.get('search_query');
  console.log(q);
  const { data, error } = useSWR(
    q ? ['api/search/' + q, q] : null,
    fetchSearchResult
  );

  React.useEffect(() => {
    document.title = q + ' - Youtube' || '';
    // eslint-disable-next-line
  }, []);

  if (!q) {
    return <Redirect to='/home' />;
  }

  // if (error) {
  //   return <MyContainer>{error.message}</MyContainer>;
  // }

  if (!data) {
    return (
      <div className={classes.container}>
        <MyContainer>
          <VideosSkeleton num={10} />
        </MyContainer>
      </div>
    );
  }

  const renderList = () => {
    return data?.items?.map((item: any) => (
      <VideoItem key={item.id?.videoId} item={item} />
    ));
  };

  return (
    <div className={classes.container}>
      <MyContainer>{renderList()}</MyContainer>
    </div>
  );
}
