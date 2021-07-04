import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

type MyContainerProps = {
  children: React.ReactNode;
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      maxWidth: '1118px',
      width: '100%',
      margin: '0 auto',
      padding: '0 12px',

      [theme.breakpoints.up('sm')]: {
        padding: '0 24px',
      },
    },
  });
});

export default function MyContainer({
  children,
}: MyContainerProps): JSX.Element {
  const classes = useStyles();

  return <div className={classes.container}>{children}</div>;
}
