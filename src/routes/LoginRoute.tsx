import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function LoginRoute({
  component: Component,
  path,
  ...rest
}: {
  component: any;
  path: string;
}): JSX.Element {
  const { isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (isSignedIn === null) {
          return <p>Loading...</p>;
        } else if (isSignedIn) {
          return <Redirect to='/' />;
        } else {
          return <Component />;
        }
      }}
    />
  );
}
