import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as videoAPI from 'api/videoAPI';
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
    sticky: {
      // position: "-webkit-sticky",
      position: 'sticky',
      top: '56px',
      zIndex: theme.zIndex.appBar,
    },
  })
);

const number = {
  popular: 48,
  skeleton: 8,
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
  const [value, setValue] = React.useState(0);
  const [mounted, setMounted] = React.useState([value]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (!mounted.includes(newValue)) {
      setMounted([...mounted, newValue]);
    }
    setValue(newValue);
  };

  const data = React.useMemo(
    () => [
      { label: 'Mới nhất', req: fetchNews },
      { label: 'Âm nhạc', req: fetchMusics },
      { label: 'Động vật', req: fetchPets },
      { label: 'Thể thao', req: fetchSports },
      { label: 'Trò chơi', req: fetchGames },
      { label: 'Hài kịch', req: fetchComedy },
      { label: 'Giải trí', req: fetchEntertainment },
      { label: 'Chính trị', req: fetchPolitics },
      { label: 'Giáo dục', req: fetchEducation },
      { label: 'Công nghệ', req: fetchTechnology },
    ],
    []
  );

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
          <img
            width={80}
            height={80}
            src='/trending_avatar.png'
            alt='trending logo'
          />
        </Box>
        <Typography align='center' variant='h2' className={classes.title}>
          Thịnh hành
        </Typography>
      </Box>

      <Tabs
        className={`${classes.sticky} ${classes.tabs}`}
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='primary'
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
            <List
              title={item.label}
              request={item.req}
              skeletons={number.skeleton}
            />
          )}
        </TabPanel>
      ))}
    </Box>
  );
}
