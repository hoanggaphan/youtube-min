import { isLogin } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PublicRoute({
  restricted = false,
  component: Component,
  layout: Layout,
  ...rest
}: {
  restricted?: boolean;
  component: any;
  layout?: React.ElementType;
  exact?: boolean;
  path: string;
}): JSX.Element {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (isLogin() && restricted) return <Redirect to='/' />;

        if (Layout)
          return (
            <Layout>
              <Component {...routeProps} />
            </Layout>
          );

        return <Component {...routeProps} />;
      }}
    />
  );
}
