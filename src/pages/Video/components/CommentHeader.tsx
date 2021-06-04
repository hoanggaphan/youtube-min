import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import SortIcon from '@material-ui/icons/Sort';
import useVideo from 'app/useVideo';
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

export default function CommentHeader() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const open = Boolean(anchorEl);

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
      <Popover
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
        <List component='nav' aria-label='secondary mailbox folders'>
          <ListItem
            onClick={(event) => handleListItemClick(event, 0)}
            selected={selectedIndex === 0}
            button
          >
            <ListItemText primary='Bình luận hàng đầu' />
          </ListItem>
          <ListItem
            onClick={(event) => handleListItemClick(event, 1)}
            selected={selectedIndex === 1}
            button
          >
            <ListItemText primary='Mới nhất xếp trước' />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
}
