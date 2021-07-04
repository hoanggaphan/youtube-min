import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

type ProtectedRouteProps = {
  component: any;
  exact?: boolean;
  path: string;
};

export default function RouteAuth({
  component: Component,
  path,
  ...rest
}: ProtectedRouteProps): JSX.Element {
  const { isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (isSignedIn === null) {
          return <p>Loading...</p>;
        } else if (isSignedIn) {
          return path === '/' ? <Redirect to='/home' /> : <Component />;
        } else {
          return path === '/' ? <Component /> : <Redirect to='/' />;
        }
      }}
    />
  );
}
