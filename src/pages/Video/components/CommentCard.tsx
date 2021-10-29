import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Skeleton from '@material-ui/lab/Skeleton';
import FormattedString from 'components/FormattedString';
import { formatDateView, formatLikeCount } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import Collapsed from './Collapsed';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    btnMore: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: theme.palette.grey[600],
    },
    actionIconBtn: {
      padding: '8px',
    },
    actionIconBtnML: {
      marginLeft: '-8px',
    },
    actionIcon: {
      fontSize: '16px',
    },
    actionText: {
      padding: '8px 16px',
      cursor: 'pointer',
      userSelect: 'none',

      lineHeight: 1,
      fontSize: '13px',
      fontWeight: 'bold',
      color: theme.palette.grey[600],
    },
    actionLike: {
      marginRight: '8px',
    },
    colorPrimary: {
      color: theme.palette.primary.main,
    },
    avatar: {
      textDecoration: 'none',
      '& img': {
        backgroundColor: 'rgba(0,0,0,.11)',
      },
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  });
});

const StyledBtn = ({ text }: { text: string }) => {
  const classes = useStyles();

  return (
    <MuiLink className={classes.btnMore} component='button' color='inherit'>
      {text}
    </MuiLink>
  );
};

export default function CommentCard({
  item,
  player,
  size = 40,
}: {
  item: any;
  player?: any;
  size?: number;
}): JSX.Element {
  const classes = useStyles();
  const snippet = item.snippet.topLevelComment?.snippet || item.snippet; // use for comment or sub comment

  console.log(snippet.authorChannelId.value);

  return (
    <Box display='flex'>
      <Box mr='16px' alignSelf='flex-start'>
        <LazyLoad
          placeholder={<Skeleton variant='circle' width={size} height={size} />}
          once
          offset={400}
        >
          <Link
            className={classes.avatar}
            to={`/channel/${snippet.authorChannelId.value}`}
          >
            <Avatar
              component={Box}
              width={size}
              height={size}
              src={snippet.authorProfileImageUrl}
            >
              {getLastWord(snippet.authorDisplayName).charAt(0)}
            </Avatar>
          </Link>
        </LazyLoad>
      </Box>

      <Box>
        <Box display='flex'>
          <Typography
            className={classes.link}
            variant='subtitle2'
            component={Link}
            to={`/channel/${snippet.authorChannelId.value}`}
          >
            {snippet.authorDisplayName}
          </Typography>
          <Box ml='5px'>
            <Typography variant='caption'>
              {formatDateView(snippet.publishedAt)}
            </Typography>
          </Box>
        </Box>

        <Collapsed
          height={80}
          BtnEx={<StyledBtn text='Đọc thêm' />}
          BtnCol={<StyledBtn text='Ản bớt' />}
          showBtnCol
        >
          <FormattedString str={snippet.textOriginal} player={player} />
        </Collapsed>

        <Box mt='4px' display='flex' alignItems='center'>
          {snippet.viewerRating === 'like' ? (
            <IconButton
              color='primary'
              className={`${classes.actionIconBtn} ${classes.actionIconBtnML}`}
            >
              <ThumbUpIcon className={classes.actionIcon} />
            </IconButton>
          ) : (
            <IconButton
              className={`${classes.actionIconBtn} ${classes.actionIconBtnML}`}
            >
              <ThumbUpIcon className={classes.actionIcon} />
            </IconButton>
          )}

          {snippet.likeCount > 0 && (
            <Typography
              variant='caption'
              className={`${classes.actionLike} ${
                snippet.viewerRating === 'like' && classes.colorPrimary
              }`}
            >
              {formatLikeCount(snippet.likeCount)}
            </Typography>
          )}

          {snippet.viewerRating === 'dislike' ? (
            <IconButton color='primary' className={classes.actionIconBtn}>
              <ThumbDownIcon className={classes.actionIcon} />
            </IconButton>
          ) : (
            <IconButton className={classes.actionIconBtn}>
              <ThumbDownIcon className={classes.actionIcon} />
            </IconButton>
          )}

          <Typography variant='button' className={classes.actionText}>
            Phản hồi
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
