import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      margin: '0 10px',
      width: '80px',
      height: '80px',

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
