import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatHHMMSStoSeconds } from 'helpers/format';
import parse from 'html-react-parser';
import React from 'react';
import { Link } from 'react-router-dom';
import XRegExp from 'xregexp';

const regexUrl = XRegExp(
  `https?:\\/\\/(www\\.)?[-\\p{L}\\p{N}@:%._+~#=]{1,256}\\.[\\p{L}\\p{N}]{1,10}\\b([-\\p{L}\\p{N}()@:%_+.~#?&//=]*)`,
  'g'
);
const regexHashTag = XRegExp('#[-\\p{L}\\p{N}@:%._+~#=]*', 'g');
const regexTime =
  /\b([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)\b|\b([0-5]?\d):([0-5]\d)\b/g;

function addHtmlTags(str: string, player?: any) {
  if (player) {
    str = str.replace(regexTime, (time) => {
      return `<a component="Time" data-time=${formatHHMMSStoSeconds(
        time
      )}>${time}</a>`;
    });
  }

  return str
    .replace(
      regexUrl,
      (url) =>
        `<a class='link' href=${url} spellcheck="false" rel="noopener noreferrer nofollow" target="_blank">${url}</a>`
    )
    .replace(regexHashTag, (hashTag) => `<a component="Link" >${hashTag}</a>`);
}

const playTimeControl = (player: any, time: any) => {
  if (!player || !time) {
    return;
  }

  player.seekTo(time);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

function stringToReact(str: string, player?: any) {
  return parse(addHtmlTags(str, player), {
    replace: (domNode: any) => {
      const { attribs, children } = domNode;

      if (attribs && attribs.component === 'Link') {
        return (
          <Link className='link' to='/home'>
            {children[0].data}
          </Link>
        );
      }

      if (attribs && attribs.component === 'Time') {
        return (
          <span
            className='link'
            onClick={() => playTimeControl(player, attribs['data-time'])}
          >
            {children[0].data}
          </span>
        );
      }
    },
  });
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
