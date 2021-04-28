import React from 'react';
import Box from '@material-ui/core/Box';

type TabPanelProps = {
  children?: React.ReactNode;
};

export default function TabPanel({ children }: TabPanelProps): JSX.Element {
  return <Box pt='25px'>{children}</Box>;
}
