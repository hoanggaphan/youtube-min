import Popover, { PopoverProps } from '@material-ui/core/Popover';
import React from 'react';
import { RemoveScroll } from 'react-remove-scroll';

export default function MyPopover(props: PopoverProps): JSX.Element {
  return (
    <Popover disableScrollLock {...props}>
      <RemoveScroll removeScrollBar={false}>{props.children}</RemoveScroll>
    </Popover>
  );
}
