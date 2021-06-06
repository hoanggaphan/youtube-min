import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@keyframes spinner': {
      to: {
        transform: 'rotate(1turn)',
      },
    },

    spinner: {
      display: 'inline-block',
      width: '2rem',
      height: '2rem',
      verticalAlign: 'text-bottom',
      border: '.25em solid',
      borderRight: '.25em solid transparent',
      borderRadius: '50%',
      animation: '$spinner .75s linear infinite',
    },
  })
);

export default function Spinner(): JSX.Element {
  const classes = useStyles();
  return <div className={classes.spinner}></div>;
}
