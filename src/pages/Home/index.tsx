import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as videoAPI from 'api/videoAPI';
import useVideos from 'app/useVideos';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/useAuth';
import { globalContext } from 'hooks/useGlobal';
import React from 'react';
import { Link } from 'react-router-dom';
import List from './components/List';
import Subscription from './components/Subscription';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(18),
      height: theme.spacing(18),
      fontSize: theme.spacing(10),
    },
    center: {
      margin: '0 auto',
    },
    name: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.3rem',
      },
    },
    mt2: {
      marginTop: theme.spacing(2),
    },
    link: {
      color: 'black',
      fontWeight: 500,
    },
  })
);

const popularNum = 8;
const likedNum = 4;
const disLikedNum = 4;
const fetchPopular = () => videoAPI.fetchMostPopularVideos(popularNum);
const fetchLiked = () => videoAPI.fetchMyRatingVideos('like', likedNum);
// Because API returns wrong result, (num + 1) will fix the above error
const fetchDisliked = () =>
  videoAPI.fetchMyRatingVideos('dislike', disLikedNum + 1);

export default function Home(): JSX.Element {
  const { user, revokeAccess, signOut } = useAuth();
  const classes = useStyles();
  const { state, dispatch } = React.useContext(globalContext);

  const resPopular = useVideos('chart=mostPopular', fetchPopular);
  const resLiked = useVideos(
    user ? `myRating=like&id=${user.id}` : null,
    fetchLiked
  );
  const resDisliked = useVideos(
    user ? `myRating=dislike&id=${user.id}` : null,
    fetchDisliked
  );

  React.useEffect(() => {
    document.title = 'Mini YouTube';
    // eslint-disable-next-line
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <Collapse in={state.alert.home}>
        <Alert
          severity='warning'
          action={
            <IconButton
              aria-label='close'
              size='small'
              onClick={() => {
                dispatch({ type: 'TOGGLE_ALERT_HOME' });
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        >
          <AlertTitle>Lưu ý</AlertTitle>
          <Typography variant='caption'>
            Dự án này sử dụng{' '}
            <a
              className={classes.link}
              href='https://developers.google.com/youtube'
              rel='noopener noreferrer'
              target='__blank'
            >
              YouTube Data API
            </a>{' '}
            - Vui lòng đọc thêm{' '}
            <Link className={classes.link} to='/note'>
              ở đây
            </Link>
          </Typography>
        </Alert>
      </Collapse>
      <Box pt='24px' mb='50px'>
        <Avatar
          src={user?.imgUrl}
          alt=''
          className={`${classes.large} ${classes.center}`}
        >
          {user && getLastWord(user.firstName).charAt(0)}
        </Avatar>
        <Typography
          align='center'
          variant='h3'
          className={`${classes.mt2} ${classes.name}`}
        >
          {user?.fullName}
        </Typography>
        <Typography
          align='center'
          variant='h3'
          className={`${classes.mt2} ${classes.name}`}
        >
          {user?.email}
        </Typography>

        <Box m='0 auto' width='fit-content' className={classes.mt2}>
          <Button onClick={revokeAccess} size='large' color='primary'>
            thu hồi quyền truy cập
          </Button>
          <Button onClick={handleSignOut} size='large' color='primary'>
            đăng xuất
          </Button>
        </Box>

        <Subscription />

        <List
          title='Video thịnh hành'
          result={resPopular}
          skeletons={popularNum}
        />
        <List title='Video đã thích' result={resLiked} skeletons={likedNum} />
        <List
          title='Video không thích'
          result={resDisliked}
          skeletons={disLikedNum}
        />
      </Box>
    </>
  );
}
