import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import React from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <PopupState variant='popover' popupId='subscribe-popup-popover'>
      {(popupState) => (
        <div>
          <div {...bindTrigger(popupState)}>{children}</div>

          <Popover
            {...bindPopover(popupState)}
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
                  component={Link}
                  to='/login'
                >
                  Đăng nhập
                </Button>
              </ListItem>
            </List>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}
