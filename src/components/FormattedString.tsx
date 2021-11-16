import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { convertHHMMSSToSeconds } from 'helpers/convert';
import { PlayerContext } from 'pages/Video';
import React from 'react';
import YouTubePlayer from 'react-player/youtube';
import reactStringReplace from 'react-string-replace';
import XRegExp from 'xregexp';

const handleSeekChange = (time: number, player: YouTubePlayer) => {
  if (!player) return;
  player.seekTo(time);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const regexHashTag = XRegExp('#([\\p{L}\\w]+)', 'g');
const regexUrl = /(https?:\/\/\S+)/g;
const regexTime =
  /(?<!:|\d)((?:\d?\d):(?:[0-5]?\d):(?:[0-5]\d)|(?:[0-5]?\d):(?:[0-5]\d))(?!\d)/g;

function stringToReact(text: string, player?: YouTubePlayer | null) {
  let replacedText;

  // Match Hashtags
  replacedText = reactStringReplace(
    text,
    regexHashTag,
    (match: string, i: number) => (
      <span key={match + i} className='link'>
        #{match}
      </span>
    )
  );

  // Match URLS
  replacedText = reactStringReplace(
    replacedText,
    regexUrl,
    (match: string, i: number) => (
      <a
        key={match + i}
        className='link'
        spellCheck='false'
        href={match}
        rel='noopener noreferrer nofollow'
        target='__blank'
      >
        {match}
      </a>
    )
  );

  if (player) {
    // Match Time hh:mm:ss
    replacedText = reactStringReplace(
      replacedText,
      regexTime,
      (match: string, i: number) => (
        <span
          key={match + i}
          className='link'
          onClick={() =>
            handleSeekChange(convertHHMMSSToSeconds(match), player)
          }
        >
          {match}
        </span>
      )
    );
  }

  return replacedText;
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    description: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',

      '& .link': {
        textDecoration: 'none',
        cursor: 'pointer',
        color: 'rgb(6, 95, 212)',
      },
    },
  });
});

export default React.memo(function FormattedString({
  str,
}: {
  str: string;
}): JSX.Element {
  const classes = useStyles();
  const player = React.useContext(PlayerContext);

  return (
    <Typography variant='body2' className={classes.description}>
      {stringToReact(str, player)}
    </Typography>
  );
});
