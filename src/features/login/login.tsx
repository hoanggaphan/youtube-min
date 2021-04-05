import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

export default function Login() {
  const classes = useStyles();

  return (
    <Container maxWidth='md'>
      <Box
        height='100vh'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        marginTop="-15vh"
      >
        <Typography variant='h3' gutterBottom>
          Đăng Nhập
        </Typography>
        <Button
          variant='contained'
          size="large"
          color='secondary'
          className={classes.button}
          startIcon={<i className='fab fa-google'></i>}
        >
          Đăng nhập với google
        </Button>
      </Box>
    </Container>
  );
}
