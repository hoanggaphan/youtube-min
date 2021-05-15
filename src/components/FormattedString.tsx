import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import React from 'react';
import { Link } from 'react-router-dom';

function addHtmlTags(str: string) {
  const regexLinks = /(http|https):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;
  const links = str.match(regexLinks);
  links?.forEach((link) => {
    str = str.replace(
      link,
      `<a href=${link} spellcheck="false" rel="noopener noreferrer nofollow" target="_blank">${link}</a>`
    );
  });

  const regexTags = /#\S+/g;
  const tags = str.match(regexTags);
  tags?.forEach((tag) => {
    const reg = new RegExp(`${tag}\\b`, 'g');
    str = str.replace(reg, `<a component="Link" >${tag}</a>`);
  });

  return str;
}

const options: HTMLReactParserOptions = {
  replace: (domNode: any) => {
    const { attribs, children } = domNode;
    if (attribs && attribs.component === 'Link') {
      return <Link to='/home'>{children[0].data}</Link>;
    }
  },
};

function stringToReactHandler(str: string) {
  return parse(addHtmlTags(str), options);
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    description: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',

      '& a': {
        textDecoration: 'none',
        color: 'rgb(6, 95, 212)',
      },
    },
  });
});

export default function FormattedString({ str }: { str: string }): JSX.Element {
  const classes = useStyles();

  return (
    <Typography variant='body2' className={classes.description}>
      {stringToReactHandler(str)}
    </Typography>
  );
}
