import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MyContainer from 'components/MyContainer';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/use-auth';
import React from 'react';
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
    mx: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
    },
  })
);

export default function Home(): JSX.Element {
  const { user, revokeAccess, signOut } = useAuth();
  const classes = useStyles();

  React.useEffect(() => {
    document.title = 'Mini YouTube';
    // eslint-disable-next-line
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <MyContainer>
      <div className={classes.mx}>
        <Avatar
          src={user?.imgUrl}
          alt='avatar'
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
      </div>
    </MyContainer>
  );
}
