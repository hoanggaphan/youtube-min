import { Fade } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  tooltip: { fontSize: '12px', padding: '8px', borderRadius: '2px' },
}));

function BootstrapTooltip(props: any): JSX.Element {
  const classes = useStylesBootstrap();
  return (
    <Tooltip
      classes={classes}
      {...props}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 250 }}
    />
  );
}

export default BootstrapTooltip;
