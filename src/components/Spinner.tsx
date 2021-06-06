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
      width: '1.7rem',
      height: '1.7rem',
      verticalAlign: 'text-bottom',
      border: '.20em solid',
      borderRight: '.20em solid transparent',
      borderRadius: '50%',
      animation: '$spinner .75s linear infinite',
    },
  })
);

export default function Spinner(): JSX.Element {
  const classes = useStyles();
  return <div className={classes.spinner}></div>;
}
