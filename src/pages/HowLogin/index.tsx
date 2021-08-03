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

        <img src='/tur1.png' width={400} alt='' />
        <img src='/tur2.png' width={400} alt='' />
        <img src='/tur3.png' width={400} alt='' />
        <img src='/tur4.png' width={400} alt='' />

        <Box mt='15px'>
          <Link to='/'>Đăng nhập</Link>
        </Box>
      </Box>
    </>
  );
}
