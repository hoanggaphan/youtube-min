import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import CommentCard from './CommentCard';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    textMore: {
      marginLeft: '15px',
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    arrowUp: {
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: `5px solid ${theme.palette.primary.main}`,
    },
    arrowDown: {
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: `5px solid ${theme.palette.primary.main}`,
    },
  });
});

export default function CommentItem({
  item,
  player,
}: {
  item: gapi.client.youtube.CommentThread;
  player?: any;
}): JSX.Element {
  const classes = useStyles();
  const [toggle, setToggle] = React.useState(false);

  const handleShow = () => {
    setToggle(!toggle);
  };

  return (
    <Box mb='16px'>
      <CommentCard item={item} player={player} />
      {item.replies && (
        <Box ml='56px'>
          {!toggle ? (
            <Box
              onClick={handleShow}
              width='fit-content'
              display='flex'
              alignItems='center'
              pb='10px'
            >
              <div className={classes.arrowDown}></div>
              <Typography variant='subtitle2' className={classes.textMore}>
                Xem câu trả lời
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                onClick={handleShow}
                width='fit-content'
                display='flex'
                alignItems='center'
                pb='10px'
              >
                <div className={classes.arrowUp}></div>
                <Typography variant='subtitle2' className={classes.textMore}>
                  Ẩn phản hồi
                </Typography>
              </Box>
              {item.replies.comments!.map((rep: any) => (
                <CommentCard
                  key={item.id}
                  item={rep}
                  player={player}
                  size={24}
                />
              ))}
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
