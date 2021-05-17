import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatHHMMSStoSeconds } from 'helpers/format';
import parse from 'html-react-parser';
import React from 'react';
import { Link } from 'react-router-dom';

function addHtmlTags(str: string, player?: any) {
  const regexUrl =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regexHashTag =
    /#[A-Za-z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\-._]+/g;

  if (player) {
    const regexTime =
      /\s([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)\s|\s([0-5]?\d):([0-5]\d)\s/g;
    str = str.replace(
      regexTime,
      (time) =>
        `<a component="Time" data-time=${formatHHMMSStoSeconds(
          time
        )}>${time}</a>`
    );
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
