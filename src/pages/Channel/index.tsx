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
import { useParams } from 'react-router';
import About from './components/About';
import Videos from './components/Videos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      height: 'calc(100vw / 6.2 - 1px)', // height info got from youtube css
      width: '100%',
      background: '#dedede no-repeat fixed',
      backgroundPosition: 'center 56px',
      backgroundSize: 'contain',

      [theme.breakpoints.up('lg')]: {
        height: 'calc((100vw - 240px) / 6.2 - 1px)',
      },
    },
    channelHeader: {
      display: 'flex',
      backgroundColor: '#f9f9f9',
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
      backgroundColor: '#f9f9f9',
    },
    sticky: {
      // position: "-webkit-sticky",
      position: 'sticky',
      top: '56px',
      zIndex: theme.zIndex.appBar,
    },
  })
);

const urlImageCropped =
  '=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

const TabPanel = (props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  const { children, value, index } = props;

  return (
    <Box mt='25px' style={{ display: value === index ? 'block' : 'none' }}>
      {children}
    </Box>
  );
};

export default function Channel(): JSX.Element {
  const classes = useStyles();
  const { id: channelId } = useParams<{ id: string }>();
  const [value, setValue] = React.useState(0);
  const { data, error, isLoading } = useChannel(channelId);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

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
      <div
        className={`background-position ${classes.banner}`}
        style={{
          backgroundImage: `url(${data?.brandingSettings?.image?.bannerExternalUrl}${urlImageCropped})`,
        }}
      />

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
        className={`${classes.sticky} ${classes.tabs}`}
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
        centered
      >
        <Tab label='Video' value={0} />
        <Tab label='Giới thiệu' value={1} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Videos channelData={data} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <About channelData={data} />
      </TabPanel>
    </>
  );
}
