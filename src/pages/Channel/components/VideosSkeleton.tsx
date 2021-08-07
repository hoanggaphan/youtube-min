import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pt: {
      paddingTop: '56.25%',
    },
  })
);

export default function VideosSkeleton({ num }: { num: number }): JSX.Element {
  const classes = useStyles();

  return (
    <>
      {[...new Array(num)].map((item, index) => (
        <div key={index}>
          <Skeleton className={classes.pt} animation={false} variant='rect' />
          <Box pt={1} pr='24px'>
            <Skeleton animation={false} />
            <Skeleton animation={false} width='60%' />
          </Box>
        </div>
      ))}
    </>
  );
}
