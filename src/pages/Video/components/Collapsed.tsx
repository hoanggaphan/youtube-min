import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

type CollapsedProps = {
  children: React.ReactNode;
  height?: number;
  BtnEx?: HTMLElement | Element | React.ReactNode;
  BtnCol?: HTMLElement | Element | React.ReactNode;
  showBtnCol?: boolean;
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    overflowY: {
      overflowY: 'hidden',
    },
    inlineBlock: {
      display: 'inline-block',
    },
    buttonMore: {
      display: 'inline-block',
      marginTop: '8px',

      textTransform: 'uppercase',
      fontSize: '14px',
      fontWeight: 500,
      color: theme.palette.grey[600],
      cursor: 'pointer',
    },
  });
});

export default function Collapsed({
  children,
  height = 60,
  BtnEx,
  BtnCol,
  showBtnCol = false,
}: CollapsedProps): JSX.Element {
  const classes = useStyles();
  const collapsedRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (collapsedRef.current && collapsedRef.current.offsetHeight > height) {
      setCollapsed(true);
    }
    // eslint-disable-next-line
  }, []);

  const handleExpandClick = () => {
    setCollapsed(false);
    setExpanded(true);
  };

  const handleCollapseClick = () => {
    setCollapsed(true);
    setExpanded(false);
  };

  function renderBtnExpand() {
    if (!collapsed) return;

    return BtnEx ? (
      <div onClick={handleExpandClick} className={classes.inlineBlock}>
        {BtnEx}
      </div>
    ) : (
      <div onClick={handleExpandClick} className={classes.buttonMore}>
        Hiển thị thêm
      </div>
    );
  }

  function renderBtnCollapse() {
    if (!showBtnCol || !expanded) return;

    return BtnCol ? (
      <div onClick={handleCollapseClick} className={classes.inlineBlock}>
        {BtnCol}
      </div>
    ) : (
      <div onClick={handleCollapseClick} className={classes.buttonMore}>
        Ẩn bớt
      </div>
    );
  }

  return (
    <>
      <div
        style={{ maxHeight: collapsed ? height : '' }}
        ref={collapsedRef}
        className={classes.overflowY}
      >
        {children}
      </div>

      {renderBtnExpand()}
      {renderBtnCollapse()}
    </>
  );
}
