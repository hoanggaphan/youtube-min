import Box from '@material-ui/core/Box';
import MyContainer from 'components/MyContainer';
import Header from 'components/Header';
import React from 'react';

export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <Header />
      <Box mt='56px'>
        <MyContainer>{children}</MyContainer>
      </Box>
    </>
  );
}
