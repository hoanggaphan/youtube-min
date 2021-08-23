import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export default function PublicRoute({
  restricted,
  component: Component,
  layout: Layout,
  ...rest
}: {
  restricted: boolean;
  component: any;
  layout?: React.ElementType;
  exact?: boolean;
  path: string;
}): JSX.Element {
  const { user } = useAuth();
  // restricted = false meaning public route
  // restricted = true meaning restricted route

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
        user && restricted ? <Redirect to='/' /> : renderComponent(Layout)
      }
    />
  );
}
