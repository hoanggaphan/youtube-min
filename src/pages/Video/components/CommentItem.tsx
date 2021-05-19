import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormattedString from 'components/FormattedString';
import { formatDateView } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';
import Collapsed from './Collapsed';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    btnMore: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: theme.palette.grey[700],
    },
  });
});

const StyledBtn = ({ text }: { text: string }) => {
  const classes = useStyles();

  return (
    <Link className={classes.btnMore} component='button' color='inherit'>
      {text}
    </Link>
  );
};

export default function CommentItem({
  item,
  player,
}: {
  item: any;
  player?: any;
}): JSX.Element {
  return (
    <Box display='flex' mb='16px'>
      <Box mr='16px'>
        <Avatar
          id='avatar'
          src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
        >
          {getLastWord(
            item.snippet.topLevelComment.snippet.authorDisplayName
          ).charAt(0)}
        </Avatar>
      </Box>

      <Box>
        <Box display='flex'>
          <Typography variant='subtitle2' component='span'>
            {item.snippet.topLevelComment.snippet.authorDisplayName}
          </Typography>
          <Box ml='5px'>
            <Typography variant='caption'>
              {formatDateView(item.snippet.topLevelComment.snippet.publishedAt)}
            </Typography>
          </Box>
        </Box>

        <Collapsed
          height={80}
          BtnEx={<StyledBtn text='Đọc thêm' />}
          BtnCol={<StyledBtn text='Ản bớt' />}
          showBtnCol
        >
          <FormattedString
            str={item.snippet.topLevelComment.snippet.textDisplay}
            player={player}
          />
        </Collapsed>
      </Box>
    </Box>
  );
}
