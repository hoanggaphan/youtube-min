import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hook';
import { addSubscription, deleteSubscription } from 'app/subscriptionSlice';
import React from 'react';

type SubscribeButtonProps = {
  exist: any;
  channelId: string;
  channelTitle: string;
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
  })
);

export default function SubscribeButton({
  exist,
  channelId,
  channelTitle,
}: SubscribeButtonProps): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUnsubscribe = () => {
    dispatch(deleteSubscription(exist[0].id))
      .then(unwrapResult)
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const handleSubscribe = () => {
    dispatch(addSubscription(channelId))
      .then(unwrapResult)
      .catch((error) => alert(error.message));
  };

  if (exist === null) return <></>;

  return (
    <>
      {exist?.length > 0 ? (
        <Button
          className={classes.registeredBtn}
          variant='contained'
          disableElevation
          disableRipple
          onClick={handleOpen}
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
          onClick={handleSubscribe}
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
