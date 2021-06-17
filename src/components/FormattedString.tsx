import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { convertHHMMSSToSeconds } from 'helpers/convert';
import React from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import XRegExp from 'xregexp';

const playTimeControl = (player: any, time: number) => {
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

function stringToReact(text: string, player?: any) {
  let replacedText;

  // Match Hashtags
  replacedText = reactStringReplace(
    text,
    regexHashTag,
    (match: string, i: number) => (
      <Link key={match + i} className='link' to={`/hashtag/${match}`}>
        #{match}
      </Link>
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
          onClick={() => playTimeControl(player, convertHHMMSSToSeconds(match))}
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
  player,
}: {
  str: string;
  player?: any;
}): JSX.Element {
  const classes = useStyles();

  return (
    <Typography variant='body2' className={classes.description}>
      {stringToReact(str, player)}
    </Typography>
  );
});
