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
import { useSnackbar } from 'notistack';
import React from 'react';
import * as commentAPI from 'api/commentAPI';
import { CommentContext } from './Comments';

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

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const query = useQuery();
  const videoId = query.get('v') || '';

  const { data } = useVideo(videoId);
  const commentCount = data?.statistics?.commentCount;

  const { state, dispatch } = React.useContext(CommentContext);
  const { enqueueSnackbar } = useSnackbar();

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
    try {
      setAnchorEl(null);
      dispatch({ type: 'SORT_PENDING' });
      dispatch({ type: 'SET_INDEX', index });

      if (index === 0) {
        const res = await commentAPI.fetchListByVideoId(videoId);
        dispatch({ type: 'SORT_FULFILLED', payload: res.result });
      } else if (index === 1) {
        const res = await commentAPI.fetchListByVideoId(
          videoId,
          '',
          50,
          'time'
        );
        dispatch({ type: 'SORT_FULFILLED', payload: res.result });
      }
    } catch (err) {
      enqueueSnackbar('An error occurred while fetching comment', {
        variant: 'error',
      });
      dispatch({ type: 'SORT_REJECTED' });
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
      >
        <List component='nav'>
          <ListItem
            onClick={(event) => handleListItemClick(event, 0)}
            selected={state.index === 0}
            button
            disableTouchRipple
          >
            <ListItemText primary='Bình luận hàng đầu' />
          </ListItem>
          <ListItem
            onClick={(event) => handleListItemClick(event, 1)}
            selected={state.index === 1}
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
