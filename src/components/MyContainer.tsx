import React from 'react';
import Container from '@material-ui/core/Container';

type MyContainerProps = {
  children: any;
};

export default function MyContainer({
  children,
}: MyContainerProps): JSX.Element {
  return (
    <Container maxWidth='md' disableGutters>
      {children}
    </Container>
  );
}
