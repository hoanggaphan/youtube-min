import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import useChannel from 'app/useChannel';
import MyContainer from 'components/MyContainer';
import SubscribeButton from 'components/SubscribeButton';
import { formatSubscriptionCount } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import PageNotFound from 'pages/NotFound';
import React from 'react';
import { Route, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import About from './components/About';
import Videos from './components/Videos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      height: 'calc(100vw / 6.2 - 1px)', // height info got from youtube css
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#dedede',

      [theme.breakpoints.up('lg')]: {
        height: 'calc((100vw - 240px) / 6.2 - 1px)',
      },
    },
    channelHeader: {
      display: 'flex',
      backgroundColor: '#fff',
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
      backgroundColor: 'rgba(0,0,0,.11)',
    },
    title: {
      fontSize: '18px',
      [theme.breakpoints.up('sm')]: {
        fontSize: '24px',
      },
    },
    tabs: {
      backgroundColor: '#fff',
    },
  })
);

const urlImageCropped =
  '=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

export default function Channel(): JSX.Element {
  const classes = useStyles();
  const { id: channelId } = useParams<{ id: string }>();
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const [value, setValue] = React.useState(pathname);
  const { data, error, isLoading } = useChannel(channelId);

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
    document.title = data?.snippet?.title + ' - Mini YouTube';
  }, [data?.snippet?.title]);

  if (error) {
    return <MyContainer>{error.message}</MyContainer>;
  }

  if (!isLoading && !data) {
    return <PageNotFound />;
  }

  return (
    <>
      {data ? (
        data?.brandingSettings?.image?.bannerExternalUrl && (
          <div
            className={classes.banner}
            style={{
              backgroundImage: `url(${data.brandingSettings.image.bannerExternalUrl}${urlImageCropped})`,
            }}
          />
        )
      ) : (
        <Skeleton animation={false} variant='rect' className={classes.banner} />
      )}

      <Box className={classes.channelHeader}>
        <Box display='flex' alignItems='center'>
          <Box mr='25px'>
            {data ? (
              <Avatar
                src={data?.snippet?.thumbnails?.default?.url}
                className={classes.avatar}
              >
                {data?.snippet?.title &&
                  getLastWord(data.snippet.title).charAt(0)}
              </Avatar>
            ) : (
              <Skeleton animation={false} variant='circle'>
                <Avatar className={classes.avatar} />
              </Skeleton>
            )}
          </Box>
          <div>
            {data?.snippet?.title ? (
              <Typography variant='h5' className={classes.title}>
                {data.snippet.title}
              </Typography>
            ) : (
              <Skeleton animation={false} variant='text' width={150} />
            )}
            {!data ? (
              <Skeleton animation={false} variant='text' width={100} />
            ) : (
              data?.statistics?.subscriberCount && (
                <Typography variant='body2' color='textSecondary'>
                  {formatSubscriptionCount(data.statistics.subscriberCount) +
                    ' người đăng ký'}
                </Typography>
              )
            )}
          </div>
        </Box>
        <Box my='10px'>
          <SubscribeButton
            channelId={channelId}
            channelTitle={data?.snippet?.title}
          />
        </Box>
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

      <Route
        exact
        path={url}
        children={({ match }) => {
          return (
            <Box
              pt='25px'
              style={{ display: match?.path === url ? 'block' : 'none' }}
            >
              <Videos channelData={data} />
            </Box>
          );
        }}
      />
      <Route
        path={`${url}/about`}
        children={({ match }) => {
          return (
            <Box
              pt='25px'
              style={{
                display: match?.path === `${url}/about` ? 'block' : 'none',
              }}
            >
              <About channelData={data} />
            </Box>
          );
        }}
      />
    </>
  );
}
