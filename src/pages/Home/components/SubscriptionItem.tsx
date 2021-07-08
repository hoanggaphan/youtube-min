import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      margin: '0 5px',
      width: '50px',
      height: '50px',

      [theme.breakpoints.up('sm')]: {
        margin: '0 10px',
        width: '80px',
        height: '80px',
      },

      cursor: 'pointer',
      '-webkit-user-drag': 'none',

      '& img': {
        '-webkit-user-drag': 'none',
      },
    },
  })
);

type SubscriptionItemProps = {
  url: string;
  text: string;
};

export default function SubscriptionItem({
  url,
  text,
}: SubscriptionItemProps): JSX.Element {
  const classes = useStyles();

  return (
    <Avatar src={url} alt={text} className={classes.avatar}>
      {text}
    </Avatar>
  );
}
