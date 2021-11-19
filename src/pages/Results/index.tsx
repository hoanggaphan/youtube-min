import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import MyContainer from 'components/MyContainer';
import { globalContext } from 'hooks/useGlobal';
import useQuery from 'hooks/useQuery';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, Redirect } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
import VideoItem from './components/VideoItem';
import VideosSkeleton from './components/VideosSkeleton';

const mockData = async () => {
  const res = await fetch(
    'https://run.mocky.io/v3/030d5b4c-9d1f-42d6-80da-53bea13184fe'
  );
  const result = res.json();
  return result;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loader: {
      display: 'inline-block',
      textAlign: 'center',
      width: '100%',
      margin: '30px',
    },
    none: {
      display: 'none',
    },
    link: {
      color: 'black',
      fontWeight: 500,
    },
  })
);

export default function Results(): JSX.Element {
  const classes = useStyles();
  const query = useQuery();
  const q = query.get('search_query');
  const { state, dispatch } = React.useContext(globalContext);

  const { data, error, setSize, size } = useSWRInfinite(
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
  }, [q]);

  if (!q) {
    return <Redirect to='/' />;
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

  const fetchMoreData = () => {
    setSize(() => size + 1);
  };

  return (
    <>
      <Collapse in={state.alert.results}>
        <Alert
          severity='warning'
          action={
            <IconButton
              aria-label='close'
              size='small'
              onClick={() => {
                dispatch({ type: 'TOGGLE_ALERT_RESULTS' });
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        >
          <AlertTitle>Lưu ý</AlertTitle>
          <Typography variant='caption'>
            Đây chỉ là trang Demo sử dụng dữ liệu tĩnh làm kết quả tìm kiếm để
            tránh vượt mức hạn ngạch - Vui lòng đọc thêm{' '}
            <Link className={classes.link} to='/note'>
              ở đây
            </Link>
          </Typography>
        </Alert>
      </Collapse>

      {data ? (
        <>
          <InfiniteScroll
            dataLength={data.reduce(
              (prev, curr) => prev + curr.items!.length,
              0
            )} //This is important field to render the next data
            next={fetchMoreData}
            hasMore={!!data[data.length - 1].nextPageToken}
            loader={<VideosSkeleton num={10} />}
          >
            <VideoList data={data} />
          </InfiniteScroll>
        </>
      ) : (
        <VideosSkeleton num={10} />
      )}
    </>
  );
}

const VideoList = React.memo(({ data }: { data: any[] }): JSX.Element => {
  return (
    <>
      {data?.map((video, index) => (
        <div key={index}>
          {video.items?.map((item: any) => (
            <VideoItem key={item.id?.videoId} item={item} />
          ))}
        </div>
      ))}
    </>
  );
});
