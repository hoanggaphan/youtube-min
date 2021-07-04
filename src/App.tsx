import { createBrowserHistory } from 'history';
import { ProvideAuth } from 'hooks/useAuth';
import HeadLayout from 'layouts/HeadLayout';
import Channel from 'pages/Channel';
import Home from 'pages/Home';
import Login from 'pages/Login';
import PageNotFound from 'pages/NotFound';
import Results from 'pages/Results';
import Video from 'pages/Video';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import RouteAuth from 'routes/RouteAuth';

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

const defaultLocale = window.navigator.language;

const RouteWithLayout = ({
  component: Component,
  ...rest
}: {
  component: any;
  exact?: boolean;
  path: string;
}): JSX.Element => (
  <RouteAuth
    {...rest}
    component={() => (
      <HeadLayout>
        <Component />
      </HeadLayout>
    )}
  />
);

function App() {
  return (
    <IntlProvider locale={defaultLocale}>
      <ProvideAuth>
        <Router history={history}>
          <Switch>
            <RouteAuth exact path='/' component={Login} />
            <RouteWithLayout path='/home' component={Home} />
            <RouteWithLayout path='/video' component={Video} />
            <RouteWithLayout path='/channel/:id' component={Channel} />
            <Redirect from='/channel' to='/home' />
            <RouteWithLayout path='/results' component={Results} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </Router>
      </ProvideAuth>
    </IntlProvider>
  );
}

export default App;
