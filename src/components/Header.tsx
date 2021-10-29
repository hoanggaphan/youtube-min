import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import SearchIcon from '@material-ui/icons/Search';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/useAuth';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
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
      backgroundColor: 'rgba(0,0,0,.11)',
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
  const history = useHistory();
  const location = useLocation();

  return (
    <header className={`${classes.header} mui-fixed`}>
      <div className={classes.container}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to='/'>
            <img
              width={120}
              height={27}
              src='/youtubelogo_30.png'
              alt='navbar logo'
            />
          </Link>

          <PopupState variant='popover' popupId='header-popup-popover'>
            {(popupState) => (
              <>
                {user ? (
                  <>
                    <Avatar
                      {...bindTrigger(popupState)}
                      src={user?.imgUrl}
                      alt=''
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
                      transitionDuration={0}
                    >
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
                      <List>
                        <Link to='/note' className={classes.link}>
                          <ListItem button>
                            <ListItemIcon className={classes.listItemIcon}>
                              <ReportProblemOutlinedIcon />
                            </ListItemIcon>
                            <Typography variant='body2'>Lưu ý</Typography>
                          </ListItem>
                        </Link>
                        <Link
                          to='/results?search_query=one+piece'
                          className={classes.link}
                        >
                          <ListItem button>
                            <ListItemIcon className={classes.listItemIcon}>
                              <SearchIcon />
                            </ListItemIcon>
                            <Typography variant='body2'>
                              Demo kết quả tìm kiếm
                            </Typography>
                          </ListItem>
                        </Link>
                        <ListItem button onClick={revokeAccess}>
                          <ListItemIcon className={classes.listItemIcon}>
                            <SyncDisabledIcon />
                          </ListItemIcon>
                          <Typography variant='body2'>
                            Thu hồi quyền truy cập
                          </Typography>
                        </ListItem>
                        <ListItem button onClick={signOut}>
                          <ListItemIcon className={classes.listItemIcon}>
                            <ExitToAppIcon />
                          </ListItemIcon>
                          <Typography variant='body2'>Đăng xuất</Typography>
                        </ListItem>
                      </List>
                    </Popover>
                  </>
                ) : (
                  <>
                    <Button
                      color='primary'
                      variant='outlined'
                      startIcon={<AccountCircleIcon />}
                      onClick={() => {
                        history.push({
                          pathname: '/login',
                          state: { from: location },
                        });
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </>
                )}
              </>
            )}
          </PopupState>
        </Box>
      </div>
    </header>
  );
}
