import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MyPopover from './MyPopover';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginBtn: {
      padding: '0',

      '&:hover': {
        backgroundColor: 'unset',
      },
    },
  })
);

interface Props {
  children: React.ReactNode;
  title: string;
  content: string;
}

export default function WithLoginPopup({ children, title, content }: Props) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <div onClick={handleClick}>{children}</div>

      <MyPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transitionDuration={0} // Fix break layout
      >
        <List component='nav' aria-label='subscription box'>
          <ListItem>
            <ListItemText primary={title} />
          </ListItem>
          <ListItem>
            <ListItemText secondary={content} />
          </ListItem>
        </List>
        <Divider />
        <List component='nav' aria-label='secondary mailbox'>
          <ListItem>
            <Button
              className={classes.loginBtn}
              color='primary'
              disableRipple
              disableFocusRipple
              disableElevation
              onClick={() => {
                history.push({
                  pathname: '/login',
                  state: { from: location },
                });
              }}
            >
              Đăng nhập
            </Button>
          </ListItem>
        </List>
      </MyPopover>
    </div>
  );
}
