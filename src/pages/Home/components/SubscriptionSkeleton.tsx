import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

export default function SubscriptionSkeleton({
  num,
}: {
  num: number;
}): JSX.Element {
  return (
    <Box display='flex' overflow='hidden' m='40px 41px 0'>
      {[...new Array(num)].map((item, index) => {
        return (
          <Box key={index} mx='10px'>
            <Skeleton
              animation={false}
              variant='circle'
              width={80}
              height={80}
            />
          </Box>
        );
      })}
    </Box>
  );
}
