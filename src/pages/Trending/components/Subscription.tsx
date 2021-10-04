import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useSubscription from 'app/useSubscription';
import useDrag from 'hooks/useDrag';
import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { useHistory } from 'react-router';
import SubscriptionItem from './SubscriptionItem';
import SubscriptionSkeleton from './SubscriptionSkeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuWrapper: {
      marginTop: '20px',
      position: 'relative',
      [theme.breakpoints.up('sm')]: {
        marginTop: '40px',
      },
    },
    scrollContainer: {
      msOverflowStyle: 'none' /* IE and Edge */,
      scrollbarWidth: 'none' /* Firefox */,

      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },

    arrowLeft: {
      width: '40px',
      height: '40px',

      position: 'absolute',
      top: '50%',
      left: '0',
      transform: 'translate(-20px, -50%)',
      zIndex: 1,

      backgroundColor: 'white',
      borderRadius: ' 50%',
      boxShadow: '0 4px 4px rgb(0 0 0 / 30%), 0 0 4px rgb(0 0 0 / 20%)',
      transition: 'none',

      '&:hover': {
        backgroundColor: 'white',
      },

      '&[disabled]': {
        visibility: 'hidden',
        opacity: '0',
      },
    },

    arrowRight: {
      width: '40px',
      height: '40px',

      position: 'absolute',
      top: '50%',
      right: '0',
      transform: 'translate(20px, -50%)',
      zIndex: 1,

      backgroundColor: 'white',
      borderRadius: ' 50%',
      boxShadow: '0 4px 4px rgb(0 0 0 / 30%), 0 0 4px rgb(0 0 0 / 20%)',
      transition: 'none',

      '&:hover': {
        backgroundColor: 'white',
      },

      '&[disabled]': {
        visibility: 'hidden',
        opacity: '0',
      },
    },

    item: {
      outline: 'none',
      userSelect: 'none',
    },

    title: {
      fontSize: '2.5rem',
      marginTop: '70px',

      [theme.breakpoints.up('sm')]: {
        fontSize: '2.7rem',
      },
    },
  })
);

const ArrowLeft = (): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { scrollPrev } = React.useContext(VisibilityContext);

  return (
    <IconButton
      disabled={false}
      onClick={() => scrollPrev()}
      className={classes.arrowLeft}
      size='small'
    >
      <NavigateBeforeIcon fontSize={matches ? 'large' : 'default'} />
    </IconButton>
  );
};
const ArrowRight = (): JSX.Element => {
  const classes = useStyles({ arrow: 'right' });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const { scrollNext } = React.useContext(VisibilityContext);

  return (
    <IconButton
      disabled={false}
      onClick={() => scrollNext()}
      className={classes.arrowRight}
      size='small'
    >
      <NavigateNextIcon fontSize={matches ? 'large' : 'default'} />
    </IconButton>
  );
};

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

export default React.memo(function Subscription(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

  const { data, error } = useSubscription();
  const subscriptions = data?.items!;

  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (newPos) => {
        if (scrollContainer.current) {
          const currentScroll = scrollContainer.current.scrollLeft;
          scrollContainer.current.scrollLeft = currentScroll + newPos;
        }
      });

  const handleItemClick = (itemId: string) => () => {
    if (dragging) {
      return false;
    }
    history.push(`/channel/${itemId}`);
  };

  if (error) {
    return (
      <>
        <Typography align='center' variant='h2' className={classes.title}>
          Kênh đăng ký
        </Typography>
        <Box textAlign='center' pt='24px'>
          {error.message}
        </Box>
      </>
    );
  }

  if (data && !data?.items?.length) {
    return (
      <>
        <Typography align='center' variant='h2' className={classes.title}>
          Kênh đăng ký
        </Typography>
        <Box textAlign='center' pt='24px'>
          Bạn chưa đăng ký bắt kỳ kênh nào!
        </Box>
      </>
    );
  }

  return (
    <>
      <Typography align='center' variant='h2' className={classes.title}>
        Kênh đăng ký
      </Typography>
      {!data ? (
        <SubscriptionSkeleton num={10} />
      ) : (
        <ScrollMenu
          wrapperClassName={classes.menuWrapper}
          scrollContainerClassName={classes.scrollContainer}
          itemClassName={classes.item}
          onMouseDown={() => dragStart}
          onMouseUp={() => dragStop}
          onMouseMove={handleDrag}
          LeftArrow={ArrowLeft}
          RightArrow={ArrowRight}
        >
          {subscriptions.map((sub: any) => {
            return (
              <SubscriptionItem
                key={sub.snippet.resourceId.channelId}
                itemId={sub.snippet.resourceId.channelId} // NOTE: itemId is required for track items
                url={sub.snippet.thumbnails.default.url}
                text={sub.snippet.title}
                onClick={handleItemClick(sub.snippet.resourceId.channelId)}
              />
            );
          })}
        </ScrollMenu>
      )}
    </>
  );
});
