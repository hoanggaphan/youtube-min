import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: { pointerEvents: 'all' },
    button: {
      color: 'inherit',
      fontSize: '13px',
    },
  });
});

export default function Snackbar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const classes = useStyles();
  const notistackRef = React.useRef<any>();

  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      classes={{ root: classes.root }}
      dense
      preventDuplicate
      action={(key) => (
        <Button className={classes.button} onClick={onClickDismiss(key)}>
          Close
        </Button>
      )}
    >
      {children}
    </SnackbarProvider>
  );
}
