import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/useAuth';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      maxWidth: '1118px',
      width: '100%',
      margin: '0 auto',
      padding: '0 12px',

      [theme.breakpoints.up('sm')]: {
        padding: '0 24px',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: '56px',
      backgroundColor: '#fff',

      position: 'fixed',
      zIndex: 1100,
      top: '0',
      left: '0',
      right: '0',
    },
    name: {
      fontSize: '16px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      cursor: 'pointer',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
    listItemIcon: {
      minWidth: 'unset',
      marginRight: '16px',
    },
  });
});

export default function Header(): JSX.Element {
  const classes = useStyles();
  const { user, revokeAccess, signOut } = useAuth();

  return (
    <header className={`${classes.header} mui-fixed`}>
      <div className={classes.container}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to='/home'>
            <img src='/youtubelogo_30.png' alt='navbar logo' />
          </Link>

          <PopupState variant='popover' popupId='header-popup-popover'>
            {(popupState) => (
              <>
                <Avatar
                  {...bindTrigger(popupState)}
                  src={user?.imgUrl}
                  alt='avatar'
                  className={`${classes.avatar}`}
                >
                  {user && getLastWord(user.firstName).charAt(0)}
                </Avatar>

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
                >
                  <Box>
                    <Box p={2}>
                      <Box display='flex' gridColumnGap='16px'>
                        <Avatar src={user?.imgUrl} alt='avatar'>
                          {user && getLastWord(user.firstName).charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant='subtitle2'
                            className={classes.name}
                          >
                            {user?.fullName}
                          </Typography>
                          <Typography variant='caption'>
                            {user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Divider />
                    <MenuList>
                      <Link
                        to='/results?search_query=one+piece'
                        className={classes.link}
                      >
                        <MenuItem>
                          <ListItemIcon className={classes.listItemIcon}>
                            <SearchIcon />
                          </ListItemIcon>
                          <Typography variant='body2'>
                            Demo kết quả tìm kiếm
                          </Typography>
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={revokeAccess}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <SyncDisabledIcon />
                        </ListItemIcon>
                        <Typography variant='body2'>
                          Thu hồi quyền truy cập
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={signOut}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <ExitToAppIcon />
                        </ListItemIcon>
                        <Typography variant='body2'>Đăng xuất</Typography>
                      </MenuItem>
                    </MenuList>
                  </Box>
                </Popover>
              </>
            )}
          </PopupState>
        </Box>
      </div>
    </header>
  );
}
