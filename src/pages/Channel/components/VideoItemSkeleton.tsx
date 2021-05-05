import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

export default function VideoItemSkeleton(): JSX.Element {
  return (
    <div>
      <Skeleton animation={false} variant='rect' width={210} height={118} />
      <Box pt={1} pr="24px">
        <Skeleton animation={false} />
        <Skeleton animation={false} width='60%' />
      </Box>
    </div>
  );
}
