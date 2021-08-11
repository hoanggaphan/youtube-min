import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

type RouteAuthProps = {
  component: any;
  exact?: boolean;
  path: string;
};

function RouteAuth({
  component: Component,
  path,
  ...rest
}: RouteAuthProps): JSX.Element {
  const { isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (isSignedIn === null) {
          return <p>Loading...</p>;
        } else if (isSignedIn) {
          return <Component />;
        } else {
          return <Redirect to='/login' />;
        }
      }}
    />
  );
}

export default function UserRoute({
  component: Component,
  layout: Layout,
  ...rest
}: {
  component: any;
  layout?: React.ElementType;
  exact?: boolean;
  path: string;
}): JSX.Element {
  return (
    <RouteAuth
      {...rest}
      component={() =>
        Layout ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
          <Component />
        )
      }
    />
  );
}
