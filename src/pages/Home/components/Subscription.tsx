import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import * as subscriptionAPI from 'api/subscriptionAPI';
import useSubscription from 'app/useSubscription';
import { useSnackbar } from 'notistack';
import React from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { useHistory } from 'react-router';
import Arrow from './Arrow';
import SubscriptionItem from './SubscriptionItem';
import SubscriptionSkeleton from './SubscriptionSkeleton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrowDisabled: {
      visibility: 'hidden',
      opacity: '0',
    },
    menu: {
      marginTop: '40px',
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

export default React.memo(function Subscription(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();

  const menuRef = React.useRef<ScrollMenu>(null);
  const isAdding = React.useRef(false);
  const [allItemsWidth, setAllItemsWidth] = React.useState<number | null>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { data, error, mutate } = useSubscription();
  const nextPageToken = data?.nextPageToken;
  const subscriptions = data?.items;

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

  const handleItemSelected = (key: string | number | null) =>
    history.push(`/channel/${key}`);

  const handleLazyLoad = async () => {
    if (!subscriptions || isAdding.current) return;

    // nextPageToken check subscriptions list from api has ended or not
    if (nextPageToken && menuRef.current) {
      const { isScrollNeeded } = menuRef.current;

      //  if have 30 items, check that 25-rd item (30-5 = 25) visible
      const last_item_will_be_visible_soon = isScrollNeeded({
        itemId: `menuItem-${subscriptions.length - 14}`,
      });

      // if 25-rd visible, it will fetch data
      if (last_item_will_be_visible_soon) {
        try {
          isAdding.current = true;
          const res = await subscriptionAPI.fetchList(nextPageToken);
          res.result.items = [...subscriptions, ...res.result.items!];
          mutate(res.result, false);
        } catch (error) {
          enqueueSnackbar('An error occurred while fetching next subscription');
        } finally {
          isAdding.current = false;
        }
      }
    }
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

  if (subscriptions && !subscriptions.length) {
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
      )}
    </>
  );
});
