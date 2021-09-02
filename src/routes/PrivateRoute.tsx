import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({
  component: Component,
  layout: Layout,
  ...rest
}: {
  component: any;
  layout?: React.ElementType;
  exact?: boolean;
  path: string;
}): JSX.Element {
  const { user } = useAuth();
  
  function renderComponent(Layout?: React.ElementType) {
    return Layout ? (
      <Layout>
        <Component />
      </Layout>
    ) : (
      <Component />
    );
  }

  return (
    <Route
      {...rest}
      component={() =>
        user ? renderComponent(Layout) : <Redirect to='/login' />
      }
    />
  );
}
