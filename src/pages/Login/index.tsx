import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    link: {
      display: 'block',
    },
  })
);

export default function Login(): JSX.Element {
  const classes = useStyles();
  const auth = useAuth();

  const handleLogin = () => auth.signIn();

  React.useEffect(() => {
    document.title = 'Đăng nhập';
  }, []);

  return (
    <Box
      height='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      marginTop='-15vh'
    >
      <Box>
        <Typography align='center' variant='h3' gutterBottom>
          Đăng Nhập
        </Typography>

        <Button
          onClick={handleLogin}
          variant='contained'
          size='large'
          color='secondary'
          className={classes.button}
          startIcon={<i className='fab fa-google'></i>}
        >
          Đăng nhập với google
        </Button>

        <Link to='/how-login' className={classes.link}>
          Hướng dẫn đăng nhập
        </Link>
      </Box>
    </Box>
  );
}
