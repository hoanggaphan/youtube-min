import { createBrowserHistory } from 'history';
import { ProvideAuth } from 'hooks/useAuth';
import Channel from 'pages/Channel';
import Home from 'pages/Home';
import Login from 'pages/Login';
import PageNotFound from 'pages/NotFound';
import Results from 'pages/Results';
import Video from 'pages/Video';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import { ProtectedRoute } from 'routes/auth';

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
            <ProtectedRoute exact path='/' component={Login} />
            <ProtectedRoute path='/home' component={Home} />
            <ProtectedRoute path='/video' component={Video} />
            <ProtectedRoute path='/channel/:id' component={Channel} />
            <Redirect from='/channel' to='/home' />
            <ProtectedRoute path='/results' component={Results} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </Router>
      </ProvideAuth>
    </IntlProvider>
  );
}

export default App;
