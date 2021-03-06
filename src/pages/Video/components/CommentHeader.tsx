import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import SortIcon from '@material-ui/icons/Sort';
import useVideo from 'app/useVideo';
import MyPopover from 'components/MyPopover';
import { formatNumberWithDots } from 'helpers/format';
import useQuery from 'hooks/useQuery';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    commentCount: {
      verticalAlign: 'middle',
      marginRight: '32px',
    },
  });
});

export default function CommentHeader({
  order,
  onSort,
}: {
  order: string;
  onSort: (order: string) => void;
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const query = useQuery();
  const videoId = query.get('v') || '';
  const { data } = useVideo(videoId);
  const commentCount = data?.statistics?.commentCount;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (order: string) => {
    onSort(order);
    handleClose();
  };

  const open = !!anchorEl;

  return (
    <Box mb='24px'>
      <Box>
        <Typography component='span' className={classes.commentCount}>
          {commentCount && formatNumberWithDots(commentCount)} bình luận
        </Typography>
        <Button onClick={handleClick} startIcon={<SortIcon />}>
          Sắp xếp theo
        </Button>
      </Box>

      <MyPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List component='nav'>
          <ListItem
            onClick={() => handleItemClick("relevance")}
            selected={order === 'relevance'}
            button
            disableTouchRipple
          >
            <ListItemText primary='Bình luận hàng đầu' />
          </ListItem>
          <ListItem
            onClick={() => handleItemClick("time")}
            selected={order === 'time'}
            button
            disableTouchRipple
          >
            <ListItemText primary='Mới nhất xếp trước' />
          </ListItem>
        </List>
      </MyPopover>
    </Box>
  );
}
