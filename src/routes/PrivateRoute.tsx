import { isLogin } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({
  component: Component,
  ...rest
}: {
  component: any;
  exact?: boolean;
  path: string;
}): JSX.Element {
  return (
    <Route
      {...rest}
      render={({ location, ...routeProps }) => {
        if (!isLogin())
          return (
            <Redirect to={{ pathname: '/login', state: { from: location } }} />
          );

        return <Component {...routeProps} />;
      }}
    />
  );
}
