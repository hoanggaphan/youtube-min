import { isLogin } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PublicRoute({
  restricted = false,
  component: Component,
  ...rest
}: {
  restricted?: boolean;
  component: any;
  exact?: boolean;
  path: string;
}): JSX.Element {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (isLogin() && restricted) return <Redirect to='/' />;

        return <Component {...routeProps} />;
      }}
    />
  );
}
