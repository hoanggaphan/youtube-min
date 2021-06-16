import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { convertQueryTimeToSeconds } from 'helpers/convert';
import React from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

const playTimeControl = (player: any, time: number) => {
  if (!player) return;
  player.seekTo(time);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

function stringToReact(str: string, player?: any) {
  return parse(str, {
    replace: (domNode: any) => {
      const { attribs, children, type, name } = domNode;
      if (type !== 'tag') return;

      if (name === 'a' && attribs.href) {
        const url = new URL(attribs.href);
        const searchParams = new URLSearchParams(url.search);

        if (searchParams.get('t')) {
          const t = searchParams.get('t');
          return (
            <span
              className='link'
              onClick={() =>
                t && playTimeControl(player, convertQueryTimeToSeconds(t))
              }
            >
              {children[0].data}
            </span>
          );
        }

        if (searchParams.get('search_query')) {
          // const s = searchParams.get('search_query');
          return (
            <Link className='link' to='/home'>
              {children[0].data}
            </Link>
          );
        }

        return (
          <a
            className='link'
            spellCheck='false'
            href={attribs.href}
            rel='noopener noreferrer nofollow'
            target='__blank'
          >
            {children[0].data}
          </a>
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
