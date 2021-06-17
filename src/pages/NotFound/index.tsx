import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import useGeolocationInfos from 'hooks/useGeolocationInfos';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    countryCode: {
      color: '#167ac6',
    },
    form: {
      height: '28px',
      display: 'flex',
      '& input': {
        fontSize: '16px',
        padding: '2px 6px',
        border: 'solid 1px #d3d3d3',
        outline: 'none',
      },
    },
    icon: {
      display: 'flex',
      placeItems: 'center',
      padding: '0 15px',

      border: 'solid 1px #d3d3d3',
      backgroundColor: '#f8f8f8',
      cursor: 'pointer',

      '&:hover': {
        borderColor: '#c6c6c6',
        backgroundColor: '#f0f0f0',
      },

      '& svg': {
        fontSize: '1.3rem',
        opacity: '.6',
      },
    },
  });
});

export default function PageNotFound(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const geoInfos = useGeolocationInfos();

  React.useEffect(() => {
    document.title = '404 Not Found';
  }, []);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <Box
      height='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      <Box textAlign='center'>
        <img src='/monkey.png' alt='' />
        <Typography>Trang này không có sẵn. Mong bạn thông cảm.</Typography>
        <Typography>Bạn thử tìm cụm từ khác xem sao nhé.</Typography>
      </Box>
      <Box mt='15px' display='flex' alignItems='center'>
        <Box mr="5px">
          <Link to='/'>
            <img src='/youtubelogo_30.png' alt='Trang chủ youtube' />
          </Link>
          <span className={classes.countryCode}>{geoInfos?.countryCode}</span>
        </Box>
        <form className={classes.form} autoComplete='off'>
          <input
            onChange={handleChange}
            value={value}
            type='text'
            placeholder='Tìm kiếm'
            title='Tìm kiếm'
          />
          <div className={classes.icon}>
            <SearchIcon />
          </div>
        </form>
      </Box>
    </Box>
  );
}
