import IconButton from '@material-ui/core/IconButton';
import React from 'react';

type ArrowProps = {
  icon: JSX.Element;
};

export default function Arrow({ icon }: ArrowProps): JSX.Element {
  return <IconButton size='small'>{icon}</IconButton>;
}
