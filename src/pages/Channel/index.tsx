import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import {
  fetchChannelById,
  selectChannelBannerExternalUrl,
  selectChannelId,
  selectChannelSubscriberCount,
  selectChannelThumbUrl,
  selectChannelTitle,
} from 'app/channelSlice';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  checkSubscriptionExist,
  selectExist,
  deleteSubscription,
  addSubscription,
} from 'app/subscriptionSlice';
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
      marginRight: '25px',
    },
    title: {
      fontSize: '18px',
      [theme.breakpoints.up('sm')]: {
        fontSize: '24px',
      },
    },
    registeredBtn: {
      backgroundColor: '#ececec',
      color: 'rgb(96, 96, 96)',
      transition: 'none',
      margin: '10px 0',

      '&:hover': {
        backgroundColor: '#ececec',
      },

      [theme.breakpoints.up('sm')]: {
        margin: '0',
      },
    },
    registerBtn: {
      transition: 'none',
      margin: '10px 0',

      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
      },

      [theme.breakpoints.up('sm')]: {
        margin: '0',
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
  const { url } = useRouteMatch();
  const { pathname } = useLocation();
  const [value, setValue] = React.useState(pathname);
  const [open, setOpen] = React.useState(false);
  const title = useAppSelector(selectChannelTitle);
  const subscriberCount = useAppSelector(selectChannelSubscriberCount);
  const bannerExternalUrl = useAppSelector(selectChannelBannerExternalUrl);
  const exist = useAppSelector(selectExist);
  const thumbUrl = useAppSelector(selectChannelThumbUrl);
  const channelId = useAppSelector(selectChannelId);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUnsubscribe = () => {
    dispatch(deleteSubscription(exist[0].id));
    setOpen(false);
  };
  const handleSubscribe = () => {
    channelId && dispatch(addSubscription(channelId));
  };

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
    dispatch(checkSubscriptionExist(id));
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    document.title = title + ' - Mini YouTube';
  }, [title]);

  function renderBtnSub() {
    if (exist === null) return;

    if (exist.length > 0) {
      return (
        <Button
          className={classes.registeredBtn}
          variant='contained'
          disableElevation
          disableRipple
          onClick={handleClickOpen}
        >
          Đã đăng ký
        </Button>
      );
    }

    return (
      <Button
        className={classes.registerBtn}
        color='secondary'
        variant='contained'
        disableElevation
        disableRipple
        onClick={handleSubscribe}
      >
        Đăng ký
      </Button>
    );
  }

  return (
    <MyContainer>
      {bannerExternalUrl && (
        <div
          className={classes.banner}
          style={{
            backgroundImage: `url(${bannerExternalUrl}${urlImageCropped})`,
          }}
        ></div>
      )}

      <Box className={classes.channelHeader}>
        <Box display='flex' alignItems='center'>
          <Avatar src={thumbUrl} className={classes.avatar}>
            {title?.charAt(0)}
          </Avatar>
          <div>
            <Typography variant='h5' className={classes.title}>
              {title}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {subscriberCount &&
                formatSubscriptionCount(subscriberCount) + ' người đăng ký'}
            </Typography>
          </div>
        </Box>
        {renderBtnSub()}
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>Hủy đăng ký {title}?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleUnsubscribe} color='primary' autoFocus>
              Hủy đăng ký
            </Button>
          </DialogActions>
        </Dialog>
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
