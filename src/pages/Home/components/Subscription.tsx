import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Alert from '@material-ui/lab/Alert';
import { useAppDispatch, useAppSelector } from 'app/hook';
import {
  fetchNextSubscriptions,
  fetchSubscriptions,
  selectLoading,
  selectNextPageToken,
  selectSubscriptions
} from 'app/subscriptionSlice';
import React from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { useHistory } from 'react-router';
import Arrow from './Arrow';
import SubscriptionItem from './SubscriptionItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrowDisabled: {
      visibility: 'hidden',
      opacity: '0',
    },
    menu: {
      marginTop: '15px',
      padding: '25px 0',
      position: 'relative',
    },
    menuItem: {
      outline: 'none',
      userSelect: 'none',
    },
    title: {
      marginTop: '50px',

      [theme.breakpoints.down('sm')]: {
        fontSize: '2.7rem',
        marginTop: '25px',
      },
    },
  })
);

const ArrowLeft = Arrow({
  icon: <NavigateBeforeIcon fontSize='large' />,
});
const ArrowRight = Arrow({
  icon: <NavigateNextIcon fontSize='large' />,
});

const SubscriptionList = (list: any) => {
  return list.map((sub: any) => {
    return (
      <SubscriptionItem
        key={sub.snippet.resourceId.channelId}
        url={sub.snippet.thumbnails.default.url}
        text={sub.snippet.title}
      />
    );
  });
};

export default function Subscription(): JSX.Element {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const menuRef = React.useRef<ScrollMenu>(null);
  const [allItemsWidth, setAllItemsWidth] = React.useState<number | null>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | null>(null);
  const loading = useAppSelector(selectLoading);
  const subscriptions = useAppSelector(selectSubscriptions);
  const nextPageToken = useAppSelector(selectNextPageToken);

  // Get Menu Width, to disable dragging when Items Width < Menu Width
  React.useEffect(() => {
    if (menuRef && menuRef.current) {
      const { allItemsWidth, menuWidth } = menuRef.current.getWidth(
        SubscriptionList(subscriptions)
      );
      setAllItemsWidth(allItemsWidth);
      setMenuWidth(menuWidth);
    }
  }, [subscriptions]);

  // Initialize list for first load
  React.useEffect(() => {
    dispatch(fetchSubscriptions());
    // eslint-disable-next-line
  }, []);

  const handleItemSelected = (key: string | number | null) =>
    history.push(`/channel/${key}`);

  const handleLazyLoad = () => {
    // nextPageToken check subscriptions list from api has ended or not
    if (nextPageToken && menuRef && menuRef.current) {
      const { isScrollNeeded } = menuRef.current;

      //  if have 30 items, check that 25-rd item (30-5 = 25) visible
      const last_item_will_be_visible_soon = isScrollNeeded({
        itemId: `menuItem-${subscriptions.length - 5}`,
      });

      // if 25-rd visible, it will fetch data
      if (last_item_will_be_visible_soon) {
        dispatch(fetchNextSubscriptions(nextPageToken));
      }
    }
  };

  const renderMenu = () => {
    if ((loading === 'idle' || loading === 'pending') && !subscriptions.length)
      return 'Loading...';

    if (loading === 'succeeded' && !subscriptions.length)
      return <Alert severity='error'>Bạn chưa đăng ký bắt kỳ kênh nào!</Alert>;

    return (
      <ScrollMenu
        ref={menuRef}
        dragging={!!allItemsWidth && !!menuWidth && allItemsWidth > menuWidth}
        wheel={false}
        data={SubscriptionList(subscriptions)}
        menuClass={classes.menu}
        itemClass={classes.menuItem}
        arrowDisabledClass={classes.arrowDisabled}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        alignCenter={false}
        hideArrows
        hideSingleArrow
        onUpdate={handleLazyLoad}
        onSelect={handleItemSelected}
      />
    );
  };

  return (
    <>
      <Typography align='center' variant='h2' className={classes.title}>
        Kênh đăng ký
      </Typography>
      {renderMenu()}
    </>
  );
}
