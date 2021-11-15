import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as commentAPI from 'api/commentAPI';
import Spinner from 'components/Spinner';
import { getLastWord } from 'helpers/string';
import { useAuth } from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useLocation } from 'react-router';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    input: {
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      },
      '&:after': {
        borderBottom: '2.5px solid black',
      },
      '& input': {
        fontSize: '14px',
        paddingTop: '0',
      },
    },
    inputDisable: {
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      },
      '&:after': {
        borderBottom: 'unset',
      },
      '& input': {
        fontSize: '14px',
        paddingTop: '0',
      },
    },
    btnText: {
      '&:hover': {
        backgroundColor: 'unset',
      },
    },
    btnPrimary: {
      transition: 'none',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    loader: {
      margin: '24px auto 0',
      width: 'fit-content',
    },
    none: {
      display: 'none',
    },
    avatar: {
      backgroundColor: 'rgba(0,0,0,.11)',
    },
  });
});

export default function CommentPost({
  videoId,
  addComment,
}: {
  videoId: string;
  addComment: (
    data: gapi.client.Response<gapi.client.youtube.CommentThread>
  ) => void;
}) {
  const classes = useStyles();
  const { user } = useAuth();
  const [show, setShow] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const location = useLocation();

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.currentTarget.value);
  };

  const handleClick = async () => {
    try {
      setAdding(true);
      const res = await commentAPI.insertByVideoId(videoId, value);
      addComment(res);
    } catch (error) {
      enqueueSnackbar('An error occurred while inserting comment', {
        variant: 'error',
      });
    } finally {
      ReactDOM.unstable_batchedUpdates(() => {
        setValue('');
        setShow(false);
        setAdding(false);
      });
    }
  };

  const handleFocus = () => {
    if (!show) {
      setShow(true);
    }
  };

  const handleHide = () => {
    setShow(false);
    setValue('');
  };

  return (
    <Box mb='32px'>
      {adding && (
        <div className={classes.loader}>
          <Spinner />
        </div>
      )}

      <Box display='flex' className={`${adding && classes.none}`}>
        <Box mr='16px'>
          <Avatar className={classes.avatar} src={user?.imgUrl}>
            {user && getLastWord(user.firstName).charAt(0)}
          </Avatar>
        </Box>

        <Box width='100%'>
          {user ? (
            <Input
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              className={classes.input}
              placeholder='Bình luẩn công khai...'
              multiline
              fullWidth
            />
          ) : (
            <Input
              className={classes.inputDisable}
              placeholder='Bình luẩn công khai...'
              multiline
              fullWidth
              readOnly
              onClick={() => {
                history.push({
                  pathname: '/login',
                  state: { from: location },
                });
              }}
            />
          )}

          {show && (
            <Box
              mt='8px'
              display='flex'
              justifyContent='flex-end'
              alignItems='center'
            >
              <Box mr='7px'>
                <Button
                  onClick={handleHide}
                  className={classes.btnText}
                  disableElevation
                  disableRipple
                >
                  Hủy
                </Button>
              </Box>

              <Button
                onClick={handleClick}
                disabled={value ? false : true}
                className={classes.btnPrimary}
                color='primary'
                variant='contained'
                disableElevation
                disableRipple
              >
                Bình luận
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
