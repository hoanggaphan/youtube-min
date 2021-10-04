import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: '50px',
      height: '50px',
      backgroundColor: 'rgba(0,0,0,.11)',
      margin: '0 5px',

      [theme.breakpoints.up('sm')]: {
        width: '80px',
        height: '80px',
        margin: '0 10px',
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
  itemId: string;
  onClick: Function;
};

export default function SubscriptionItem({
  url,
  text,
  itemId,
  onClick,
}: SubscriptionItemProps): JSX.Element {
  const classes = useStyles();

  return (
    <Avatar
      onClick={() => onClick()}
      src={url}
      alt=''
      className={classes.avatar}
    >
      {text}
    </Avatar>
  );
}
