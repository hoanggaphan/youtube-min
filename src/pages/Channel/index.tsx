import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  fetchChannelById,
  resetChannel,
  selectChannel,
} from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { fetchPlaylistItems, resetPlayListItems } from 'app/playlistItemsSlice';
import { checkSubscriptionExist, selectExist } from 'app/subscriptionSlice';
import MyContainer from 'components/MyContainer';
import SubscribeButton from 'components/SubscribeButton';
import { formatSubscriptionCount } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import { Route, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link, Switch } from 'react-router-dom';
import About from './components/About';
import TabPanel from './components/TabPanel';
import Videos from './components/Videos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      height: 'calc(100vw / 6.2 - 1px)', // height info got from youtube css
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',

      [theme.breakpoints.up('lg')]: {
        height: 'calc((100vw - 240px) / 6.2 - 1px)',
      },
    },
    channelHeader: {
      display: 'flex',
      backgroundColor: 'white',
      justifyContent: 'space-between',
      flexDirection: 'column',
      padding: '15px 40px 0',

      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    avatar: {
      width: '80px',
      height: '80px',
      fontSize: theme.spacing(5),
    },
    title: {
      fontSize: '18px',
      [theme.breakpoints.up('sm')]: {
        fontSize: '24px',
      },
    },
    tabs: {
      backgroundColor: 'white',
    },
  })
);

const urlImageCropped =
  '=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

export default function Channel(): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();
  const { url } = useRouteMatch();
  const { pathname } = useLocation();

  const [value, setValue] = React.useState(pathname);
  const [errors, setErrors] = React.useState<any>([]);

  const exist = useAppSelector(selectExist);

  const channelData = useAppSelector(selectChannel);
  const title = channelData?.snippet?.title;
  const subscriberCount = channelData?.statistics?.subscriberCount;
  const bannerExternalUrl =
    channelData?.brandingSettings?.image?.bannerExternalUrl;
  const thumbUrl = channelData?.snippet?.thumbnails?.default?.url;
  const channelId = channelData?.id;
  const playlistId = channelData?.contentDetails?.relatedPlaylists?.uploads;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  // check value of active tab when url changed
  React.useEffect(() => {
    if (value !== pathname) {
      setValue(pathname);
    }
    // eslint-disable-next-line
  }, [pathname]);

  React.useEffect(() => {
    dispatch(fetchChannelById(id))
      .then(unwrapResult)
      .catch((error) => setErrors((prevState: any) => [...prevState, error]));
    dispatch(checkSubscriptionExist(id))
      .then(unwrapResult)
      .catch((error) => setErrors((prevState: any) => [...prevState, error]));
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    playlistId && dispatch(fetchPlaylistItems(playlistId));
    // eslint-disable-next-line
  }, [playlistId]);

  React.useEffect(() => {
    return () => {
      dispatch(resetChannel());
      dispatch(resetPlayListItems());
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    document.title = title + ' - Mini YouTube';
  }, [title]);

  if (errors.length) {
    return (
      <>
        {errors.map((err: any, index: number) => (
          <MyContainer key={index}>{err.message}</MyContainer>
        ))}
      </>
    );
  }

  return (
    <MyContainer>
      {!bannerExternalUrl ? (
        <Skeleton animation={false} variant='rect' className={classes.banner} />
      ) : (
        <div
          className={classes.banner}
          style={{
            backgroundImage: `url(${bannerExternalUrl}${urlImageCropped})`,
          }}
        />
      )}

      <Box className={classes.channelHeader}>
        <Box display='flex' alignItems='center'>
          <Box mr='25px'>
            {title ? (
              <Avatar src={thumbUrl} className={classes.avatar}>
                {getLastWord(title).charAt(0)}
              </Avatar>
            ) : (
              <Skeleton animation={false} variant='circle'>
                <Avatar className={classes.avatar} />
              </Skeleton>
            )}
          </Box>
          <div>
            {title ? (
              <Typography variant='h5' className={classes.title}>
                {title}
              </Typography>
            ) : (
              <Skeleton animation={false} variant='text' width={150} />
            )}
            {!subscriberCount ? (
              <Skeleton animation={false} variant='text' width={100} />
            ) : (
              <Typography variant='body2' color='textSecondary'>
                {formatSubscriptionCount(subscriberCount) + ' người đăng ký'}
              </Typography>
            )}
          </div>
        </Box>
        {channelId && title && (
          <Box my='10px'>
            <SubscribeButton
              exist={exist}
              channelId={channelId}
              channelTitle={title}
            />
          </Box>
        )}
      </Box>

      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
        centered
      >
        <Tab label='Video' value={url} component={Link} to={url} />
        <Tab
          label='Giới thiệu'
          value={`${url}/about`}
          component={Link}
          to={`${url}/about`}
        />
      </Tabs>

      <Switch>
        <Route
          exact
          path={url}
          render={() => (
            <TabPanel>
              <Videos />
            </TabPanel>
          )}
        />
        <Route
          path={`${url}/about`}
          render={() => (
            <TabPanel>
              <About />
            </TabPanel>
          )}
        />
      </Switch>
    </MyContainer>
  );
}
