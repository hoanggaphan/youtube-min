import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import SortIcon from '@material-ui/icons/Sort';
import * as commentAPI from 'api/commentAPI';
import useComment from 'app/useComment';
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

export default function CommentHeader({
  sorting,
}: {
  sorting: (status: boolean) => void;
}) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const query = useQuery();
  const videoId = query.get('v') || '';

  const { data } = useVideo(videoId);
  const commentCount = data?.statistics?.commentCount;

  const { mutate } = useComment(videoId, true);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListItemClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    sorting(true);
    setAnchorEl(null);
    try {
      if (index === 0) {
        await mutate();
      } else if (index === 1) {
        const res = await commentAPI.fetchListByVideoId(videoId, 'time');
        const data = res.result.items!;
        mutate(data, false);
      }
    } catch (err) {
      alert('An error occurred while fetching comment');
    } finally {
      sorting(false);
    }
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
        disablePortal
      >
        <List component='nav'>
          <ListItem
            onClick={(event) => handleListItemClick(event, 0)}
            selected={selectedIndex === 0}
            button
            disableTouchRipple
          >
            <ListItemText primary='Bình luận hàng đầu' />
          </ListItem>
          <ListItem
            onClick={(event) => handleListItemClick(event, 1)}
            selected={selectedIndex === 1}
            button
            disableTouchRipple
          >
            <ListItemText primary='Mới nhất xếp trước' />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
}
