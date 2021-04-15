import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuth } from 'hooks/use-auth';
import React from 'react';
import Subscription from 'features/Subscription/Subscription';

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
    mt2: {
      marginTop: theme.spacing(2),
    },
    mt8: {
      marginTop: theme.spacing(8),
    },
  })
);

export default function Home(): JSX.Element {
  const { revokeAccess, signOut, user } = useAuth();
  const classes = useStyles();
  
  return (
    <Container maxWidth='md' className={classes.mt8}>
      <Avatar alt='avatar' className={`${classes.large} ${classes.center}`}>
        {user?.firstName.charAt(0)}
      </Avatar>
      <Typography align='center' variant='h3' className={classes.mt2}>
        {user?.firstName}
      </Typography>
      <Typography align='center' variant='h3' className={classes.mt2}>
        {user?.email}
      </Typography>

      <Box m='0 auto' width='fit-content' className={classes.mt2}>
        <Button onClick={revokeAccess} size='large' color='primary'>
          thu hồi quyền truy cập
        </Button>
        <Button onClick={signOut} size='large' color='primary'>
          đăng xuất
        </Button>
      </Box>

      <Subscription />
    </Container>
  );
}
