import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as videoAPI from 'api/videoAPI';
import useVideos from 'app/useVideos';
import React from 'react';
import List from './components/List';

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
    tabs: {
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: '2.5rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.7rem',
      },
    },
  })
);

const number = {
  popular: 48,
  liked: 4,
  disLiked: 4,
};
const fetchNews = () => videoAPI.fetchPopularVideos(number.popular);
const fetchMusics = () => videoAPI.fetchPopularVideos(number.popular, '10');
const fetchPets = () => videoAPI.fetchPopularVideos(number.popular, '15');
const fetchSports = () => videoAPI.fetchPopularVideos(number.popular, '17');
const fetchGames = () => videoAPI.fetchPopularVideos(number.popular, '20');
const fetchComedy = () => videoAPI.fetchPopularVideos(number.popular, '23');
const fetchEntertainment = () =>
  videoAPI.fetchPopularVideos(number.popular, '24');
const fetchPolitics = () => videoAPI.fetchPopularVideos(number.popular, '25');
const fetchEducation = () => videoAPI.fetchPopularVideos(number.popular, '27');
const fetchTechnology = () => videoAPI.fetchPopularVideos(number.popular, '28');

// const fetchLiked = () => videoAPI.fetchMyRatingVideos('like', number.liked);
// Because API returns wrong result, (num + 1) will fix the under error
// const fetchDisliked = () =>
//   videoAPI.fetchMyRatingVideos('dislike', number.disLiked + 1);

const TabPanel = (props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  const { children, value, index } = props;

  return (
    <Box mt='24px' style={{ display: value === index ? 'block' : 'none' }}>
      {children}
    </Box>
  );
};

export default function Home(): JSX.Element {
  const classes = useStyles();

  /**
   * Keep tabs when click begin fetch api
   * avoid fetch all api when render
   */
  const [value, setValue] = React.useState(0);
  const [mounted, setMounted] = React.useState([value]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (!mounted.includes(newValue)) {
      setMounted([...mounted, newValue]);
    }
    setValue(newValue);
  };

  const resNews = useVideos(
    mounted.includes(0) ? 'popular=news' : null,
    fetchNews
  );

  const resMusics = useVideos(
    mounted.includes(1) ? 'popular=musics' : null,
    fetchMusics
  );

  const resPets = useVideos(
    mounted.includes(2) ? 'popular=pets' : null,
    fetchPets
  );

  const resSports = useVideos(
    mounted.includes(3) ? 'popular=sports' : null,
    fetchSports
  );
  const resGames = useVideos(
    mounted.includes(4) ? 'popular=games' : null,
    fetchGames
  );
  const resComedy = useVideos(
    mounted.includes(5) ? 'popular=sports' : null,
    fetchComedy
  );
  const resEntertaiment = useVideos(
    mounted.includes(6) ? 'popular=sports' : null,
    fetchEntertainment
  );
  const resPolitics = useVideos(
    mounted.includes(7) ? 'popular=sports' : null,
    fetchPolitics
  );
  const resEducation = useVideos(
    mounted.includes(8) ? 'popular=sports' : null,
    fetchEducation
  );
  const resTechnology = useVideos(
    mounted.includes(9) ? 'popular=sports' : null,
    fetchTechnology
  );

  const data = [
    { label: 'Mới nhất', res: resNews },
    { label: 'Âm nhạc', res: resMusics },
    { label: 'Động vật', res: resPets },
    { label: 'Thể thao', res: resSports },
    { label: 'Trò chơi', res: resGames },
    { label: 'Hài kịch', res: resComedy },
    { label: 'Giải trí', res: resEntertaiment },
    { label: 'Chính trị', res: resPolitics },
    { label: 'Giáo dục', res: resEducation },
    { label: 'Công nghệ', res: resTechnology },
  ];

  // const resLiked = useVideos(
  //   user ? `myRating=like&id=${user.id}` : null,
  //   fetchLiked
  // );
  // const resDisliked = useVideos(
  //   user ? `myRating=dislike&id=${user.id}` : null,
  //   fetchDisliked
  // );

  React.useEffect(() => {
    document.title = 'Mini YouTube';
    // eslint-disable-next-line
  }, []);

  return (
    <Box mb='50px'>
      <Box
        pt='16px'
        display='flex'
        justifyContent='center'
        alignItems='center'
        bgcolor='#f9f9f9'
      >
        <Box mr='24px'>
          <img width={80} src='/trending_avatar.png' alt='' />
        </Box>
        <Typography align='center' variant='h2' className={classes.title}>
          Thịnh hành
        </Typography>
      </Box>

      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
        // centered
        variant='scrollable'
        scrollButtons='auto'
      >
        {data.map((item, index) => (
          <Tab key={index} label={item.label} value={index} />
        ))}
      </Tabs>

      {data.map((item, index) => (
        <TabPanel key={index} value={value} index={index}>
          {mounted.includes(index) && (
            <List result={item.res} skeletons={number.popular} />
          )}
        </TabPanel>
      ))}
    </Box>
  );
}
