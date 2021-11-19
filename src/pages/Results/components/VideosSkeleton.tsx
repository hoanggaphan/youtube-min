import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: '16px',
      display: 'flex',
      columnGap: '16px',
      [theme.breakpoints.down('xs')]: {
        marginTop: '12px',
        columnGap: '10px',
      },
    },
    img: {
      paddingTop: 'calc((202/360) * 100%)', // height/width aspect ratio
    },
  })
);

export default React.memo(function VideosSkeleton({
  num,
}: {
  num: number;
}): JSX.Element {
  const classes = useStyles();
  
  return (
    <>
      {[...new Array(num)].map((item, index) => (
        <Box key={index} className={classes.container}>
          <Box flex='1' maxWidth='360px' minWidth='160px'>
            <Skeleton
              animation={false}
              variant='rect'
              className={classes.img}
            />
          </Box>
          <Box flex='1'>
            <Skeleton animation={false} />
            <Skeleton animation={false} />

            <Box mt='5px' display='flex' alignItems='center'>
              <Box mr='10px'>
                <Skeleton
                  animation={false}
                  variant='circle'
                  width='24px'
                  height='24px'
                />
              </Box>
              <Skeleton animation={false} width='20%' height='20px' />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
});
