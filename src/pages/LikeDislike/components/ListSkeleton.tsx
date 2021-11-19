import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridImgContainer: {
      position: 'relative',

      '&::before': {
        display: 'block',
        content: "''",
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0,0,0,.11)',
      },
    },
  })
);

export default React.memo(function ListSkeleton({ num }: { num: number }) {
  const classes = useStyles();
  
  return (
    <>
      {[...new Array(num)].map((item, index) => (
        <div key={index}>
          <div className={classes.gridImgContainer}></div>
          <Box mt='12px'>
            <Box display='flex' gridColumnGap='12px'>
              <Skeleton
                animation={false}
                variant='circle'
                width={40}
                height={40}
              />

              <Box flex='1'>
                <Skeleton animation={false} />
                <Skeleton animation={false} width='60%' />
              </Box>
            </Box>
          </Box>
        </div>
      ))}
    </>
  );
});
