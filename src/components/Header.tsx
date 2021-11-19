import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import SearchIcon from '@material-ui/icons/Search';
import SyncDisabledIcon from '@material-ui/icons/SyncDisabled';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import MyPopover from './MyPopover';

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

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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

          {user ? (
            <>
              <Avatar
                onClick={handleClick}
                src={user?.imgUrl}
                alt=''
                className={`${classes.avatar}`}
              >
                {user && getLastWord(user.firstName).charAt(0)}
              </Avatar>
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
                transitionDuration={0}
              >
                <Box p={2}>
                  <Box display='flex' gridColumnGap='16px'>
                    <Avatar src={user?.imgUrl} alt='avatar'>
                      {user && getLastWord(user.firstName).charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle2' className={classes.name}>
                        {user?.fullName}
                      </Typography>
                      <Typography variant='caption'>{user?.email}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <List>
                  <ListItem
                    button
                    onClick={() => {
                      history.push({
                        pathname: '/note',
                        state: { from: location },
                      });
                    }}
                  >
                    <ListItemIcon className={classes.listItemIcon}>
                      <ReportProblemOutlinedIcon />
                    </ListItemIcon>
                    <Typography variant='body2'>Lưu ý</Typography>
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => {
                      history.push({
                        pathname: '/results',
                        search: '?search_query=one+piece',
                        state: { from: location },
                      });
                      handleClose();
                    }}
                  >
                    <ListItemIcon className={classes.listItemIcon}>
                      <SearchIcon />
                    </ListItemIcon>
                    <Typography variant='body2'>
                      Demo kết quả tìm kiếm
                    </Typography>
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => {
                      history.push({
                        pathname: '/like',
                        state: { from: location },
                      });
                      handleClose();
                    }}
                  >
                    <ListItemIcon className={classes.listItemIcon}>
                      <ThumbUpAltOutlinedIcon />
                    </ListItemIcon>
                    <Typography variant='body2'>Video đã like</Typography>
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => {
                      history.push({
                        pathname: '/dislike',
                        state: { from: location },
                      });
                      handleClose();
                    }}
                  >
                    <ListItemIcon className={classes.listItemIcon}>
                      <ThumbDownAltOutlined />
                    </ListItemIcon>
                    <Typography variant='body2'>Video đã dislike</Typography>
                  </ListItem>

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
              </MyPopover>
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
        </Box>
      </div>
    </header>
  );
}
