import React from 'react';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

type MyContainerProps = {
  children: any;
};

export default function MyContainer({
  children,
}: MyContainerProps): JSX.Element {
  return (
    <Container maxWidth='md' disableGutters>
      <Link to='/home'>Home</Link>
      {children}
    </Container>
  );
}
