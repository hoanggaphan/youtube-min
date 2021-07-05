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
import UserRoute from 'routes/UserRoute';

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

const defaultLocale = window.navigator.language;

function App() {
  return (
    <IntlProvider locale={defaultLocale}>
      <ProvideAuth>
        <Router history={history}>
          <Switch>
            <UserRoute exact path='/' component={Login} />
            <UserRoute path='/home' component={Home} layout={HeadLayout} />
            <UserRoute path='/video' component={Video} layout={HeadLayout} />
            <UserRoute
              path='/channel/:id'
              component={Channel}
              layout={HeadLayout}
            />
            <Redirect from='/channel' to='/home' />
            <UserRoute
              path='/results'
              component={Results}
              layout={HeadLayout}
            />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </Router>
      </ProvideAuth>
    </IntlProvider>
  );
}

export default App;
