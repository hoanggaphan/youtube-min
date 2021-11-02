import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

export default function HowLogin() {
  return (
    <>
      <Box
        my='50px'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Typography align='center' variant='h3' gutterBottom>
          Hướng dẫn đăng nhập
        </Typography>

        <img src='/tur1.jpg' width={400} alt='tur 1' />
        <img src='/tur2.jpg' width={400} alt='tur 2' />
        <img src='/tur3.jpg' width={400} alt='tur 3' />

        <Box mt='15px'>
          <Link to='/login'>Đăng nhập</Link>
        </Box>
      </Box>
    </>
  );
}
