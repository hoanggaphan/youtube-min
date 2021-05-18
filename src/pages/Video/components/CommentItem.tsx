import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormattedString from 'components/FormattedString';
import { formatDateView } from 'helpers/format';
import { getLastWord } from 'helpers/string';
import React from 'react';

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
        <FormattedString
          str={item.snippet.topLevelComment.snippet.textDisplay}
          player={player}
        />
      </Box>
    </Box>
  );
}
