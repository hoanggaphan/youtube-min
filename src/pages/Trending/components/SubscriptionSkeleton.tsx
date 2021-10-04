import { useMediaQuery, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

export default function SubscriptionSkeleton({
  num,
}: {
  num: number;
}): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Box
      display='flex'
      overflow='hidden'
      m={matches ? '40px 41px 0' : '20px 30px 0'}
    >
      {[...new Array(num)].map((item, index) => {
        return (
          <Box key={index} mx={matches ? '10px' : '5px'}>
            <Skeleton
              animation={false}
              variant='circle'
              width={matches ? 80 : 50}
              height={matches ? 80 : 50}
            />
          </Box>
        );
      })}
    </Box>
  );
}
