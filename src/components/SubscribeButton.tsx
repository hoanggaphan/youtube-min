import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as subscriptionAPI from 'api/subscriptionAPI';
import { useSnackbar } from 'notistack';
import React from 'react';
import useSWR from 'swr';

type SubscribeButtonProps = {
  channelId: string;
  channelTitle: string | undefined;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    registeredBtn: {
      width: '100%',
      backgroundColor: '#ececec',
      color: 'rgb(96, 96, 96)',
      transition: 'none',
      '&:hover': {
        backgroundColor: '#ececec',
      },
    },
    registerBtn: {
      width: '100%',
      transition: 'none',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
      },
    },
    skeleton: {
      height: '36px',
      borderRadius: '4px',
      backgroundColor: 'rgba(0, 0, 0, 0.11)',
      [theme.breakpoints.up('sm')]: {
        width: '117px',
      },
    },
  })
);

const fetchStatus = async (url: string, channelId: string) => {
  try {
    const response = await subscriptionAPI.fetchStatus(channelId);
    return response.result.items;
  } catch (error) {
    error.result.error.message =
      'An error occurred while checking exist subscription';
    throw error.result.error;
  }
};

export default function SubscribeButton({
  channelId,
  channelTitle,
}: SubscribeButtonProps): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, mutate } = useSWR(
    ['api/subscription/status', channelId],
    fetchStatus
  );

  // eslint-disable-next-line
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUnsubscribe = async () => {
    try {
      await subscriptionAPI.unSubscribe(data![0].id!);
      mutate([], false);
    } catch (error) {
      enqueueSnackbar('An error occurred while deleting subscription', {
        variant: 'error',
      });
    } finally {
      setOpen(false);
    }
  };

  // eslint-disable-next-line
  const handleSubscribe = async () => {
    try {
      const res = await subscriptionAPI.subscribe(channelId);
      mutate([res.result], false);
    } catch (error) {
      enqueueSnackbar('An error occurred while subscripting', {
        variant: 'error',
      });
    }
  };

  // turn off feature subscribe channel
  const off = () => {
    enqueueSnackbar('Chức năng này đã bị tắt', {
      variant: 'warning',
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) return <div className={classes.skeleton} />;

  return (
    <>
      {data?.length ? (
        <Button
          className={classes.registeredBtn}
          variant='contained'
          disableElevation
          disableRipple
          // onClick={handleOpen}
          onClick={off}
        >
          Đã đăng ký
        </Button>
      ) : (
        <Button
          className={classes.registerBtn}
          color='secondary'
          variant='contained'
          disableElevation
          disableRipple
          // onClick={handleSubscribe}
          onClick={off}
        >
          Đăng ký
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>Hủy đăng ký {channelTitle}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleUnsubscribe} color='primary' autoFocus>
            Hủy đăng ký
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
