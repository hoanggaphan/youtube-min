import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as commentAPI from 'api/commentAPI';
import React from 'react';
import CommentCard from './CommentCard';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ReactDOM from 'react-dom';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    ml8: {
      marginLeft: '8px',
    },
    textMore: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    arrowIcon: {
      width: '20px',
      height: '20px',
      color: theme.palette.primary.main,
    },
    userSelect: {
      userSelect: 'none',
    },
    none: {
      display: 'none',
    },
  });
});

export default function CommentItem({
  item,
  player,
}: {
  item: gapi.client.youtube.CommentThread;
  player?: any;
}): JSX.Element {
  const classes = useStyles();
  const isFirstReqSucceed = React.useRef(false);

  const [isFetching, setIsFetching] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [replies, setReplies] = React.useState<gapi.client.youtube.Comment[]>(
    []
  );
  const [nextPageToken, setNextPageToken] = React.useState<string>();

  const handleShow = async () => {
    setShow(true);
    if (!isFirstReqSucceed.current && !isFetching) {
      try {
        setIsFetching(true);
        const res = await commentAPI.fetchRepliesById(item.id!);
        isFirstReqSucceed.current = true;
        ReactDOM.unstable_batchedUpdates(() => {
          setReplies(res.result.items!);
          setNextPageToken(res.result.nextPageToken);
          setIsFetching(false);
        });
      } catch (error) {
        // console.log(error);
        setIsFetching(false);
        const message = "An error occurred while fetching user's replies";
        alert(message);
      }
    }
  };

  const handleHide = () => {
    setShow(false);
  };
  console.log(replies);
  const handleFetchNextReplies = async () => {
    if (!isFetching) {
      try {
        setIsFetching(true);
        const res = await commentAPI.fetchRepliesById(
          item.id!,
          nextPageToken,
          20
        );
        isFirstReqSucceed.current = true;
        ReactDOM.unstable_batchedUpdates(() => {
          setIsFetching(false);
          setReplies([...replies, ...res.result.items!]);
          setNextPageToken(res.result.nextPageToken);
        });
      } catch (error) {
        // console.log(error);
        setIsFetching(false);
        const message = "An error occurred while fetching next user's replies";
        alert(message);
      }
    }
  };

  return (
    <Box mb='16px'>
      <CommentCard item={item} player={player} />
      {item.replies && (
        <Box ml='56px'>
          <Box
            onClick={handleShow}
            width='fit-content'
            display='flex'
            alignItems='center'
            pb='10px'
            className={`${classes.userSelect} ${show && classes.none}`}
          >
            <ArrowDropDownIcon className={classes.arrowIcon} />
            <Typography
              variant='subtitle2'
              className={`${classes.textMore} ${classes.ml8}`}
            >
              Xem câu trả lời
            </Typography>
          </Box>

          <Box
            onClick={handleHide}
            width='fit-content'
            display='flex'
            alignItems='center'
            pb='10px'
            className={`${classes.userSelect} ${!show && classes.none}`}
          >
            <ArrowDropUpIcon className={classes.arrowIcon} />
            <Typography
              variant='subtitle2'
              className={`${classes.textMore} ${classes.ml8}`}
            >
              Ẩn phản hồi
            </Typography>
          </Box>

          <div className={`${!show && classes.none}`}>
            <div>
              {replies.map((rep: gapi.client.youtube.Comment) => (
                <CommentCard
                  key={rep.id}
                  item={rep}
                  player={player}
                  size={24}
                />
              ))}
            </div>

            {nextPageToken && (
              <Box
                width='fit-content'
                display='flex'
                alignItems='center'
                pb='10px'
                className={`${classes.userSelect} ${
                  isFetching && classes.none
                }`}
                onClick={handleFetchNextReplies}
              >
                <Box ml='8px' mr='12px'>
                  <SubdirectoryArrowRightIcon className={classes.arrowIcon} />
                </Box>
                <Typography variant='subtitle2' className={classes.textMore}>
                  Hiển thị thêm phản hồi
                </Typography>
              </Box>
            )}

            <Box
              className={`${!isFetching && classes.none}`}
              pt='16px'
              pb='10px'
            >
              <CircularProgress size={30} color='inherit' />
            </Box>
          </div>
        </Box>
      )}
    </Box>
  );
}
