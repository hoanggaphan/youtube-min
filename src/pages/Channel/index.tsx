import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { fetchChannelById, selectChannel } from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import MyContainer from 'components/MyContainer';
import { formatSubscriptionCount } from 'helpers/format';
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
    avatar: {
      width: '80px',
      height: '80px',
      fontSize: theme.spacing(5),
      marginRight: '25px',
    },
    registeredBtn: {
      marginRight: '5px',
      '&:hover': {
        backgroundColor: '#e0e0e0',
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
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const channel = useAppSelector(selectChannel);
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const [value, setValue] = React.useState(pathname);

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
    dispatch(fetchChannelById(id));
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    document.title = channel.snippet.title + ' - Mini YouTube';
  }, [channel]);

  return (
    <MyContainer>
      {channel.brandingSettings.image?.bannerExternalUrl && (
        <div
          className={classes.banner}
          style={{
            backgroundImage: `url(${channel.brandingSettings.image.bannerExternalUrl}${urlImageCropped})`,
          }}
        ></div>
      )}

      <Box
        bgcolor='white'
        p='15px 40px 0'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' alignItems='center'>
          <Avatar
            src={channel.snippet.thumbnails.default.url}
            className={classes.avatar}
          >
            {channel.snippet.title?.charAt(0)}
          </Avatar>
          <div>
            <Typography variant='h5'>{channel.snippet.title}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {channel.statistics.subscriberCount &&
                formatSubscriptionCount(channel.statistics.subscriberCount) +
                  ' người đăng ký'}
            </Typography>
          </div>
        </Box>
        <Box display='flex' alignItems='center'>
          <Button
            className={classes.registeredBtn}
            variant='contained'
            disableElevation
            disableRipple
          >
            Đã đăng ký
          </Button>
          <IconButton aria-label='subscription notification' component='span'>
            <NotificationsNoneIcon color='action' />
          </IconButton>
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
