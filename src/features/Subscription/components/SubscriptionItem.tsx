import Avatar from '@material-ui/core/Avatar';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      margin: '0 10px',
      cursor: 'pointer',
      width: '88px',
      height: '88px',
    },
  })
);

type SubscriptionItemProps = {
  id: string;
  url: string;
  text: string;
};

export default function SubscriptionItem({
  id,
  url,
  text,
}: SubscriptionItemProps): JSX.Element {
  const classes = useStyles();

  return (
    <Link to={`/${id}`}>
      <Avatar src={url} alt={text} className={classes.avatar}>
        {text}
      </Avatar>
    </Link>
  );
}
