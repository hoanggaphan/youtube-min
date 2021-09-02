import Snackbar from 'components/Snackbar';
import { createBrowserHistory } from 'history';
import { useAuth } from 'hooks/useAuth';
import HeadLayout from 'layouts/HeadLayout';
import Channel from 'pages/Channel';
import Home from 'pages/Home';
import HowLogin from 'pages/HowLogin';
import Login from 'pages/Login';
import Note from 'pages/Note';
import PageNotFound from 'pages/NotFound';
import Results from 'pages/Results';
import Video from 'pages/Video';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Redirect, Router, Switch } from 'react-router-dom';
import PrivateRoute from 'routes/PrivateRoute';
import PublicRoute from 'routes/PublicRoute';

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

const defaultLocale = window.navigator.language;

function App() {
  const { initialized } = useAuth();

  return (
    <IntlProvider locale={defaultLocale}>
      {initialized ? (
        <Snackbar>
          <Router history={history}>
            <Switch>
              <PublicRoute
                restricted={false}
                exact
                path='/'
                component={Home}
                layout={HeadLayout}
              />
              <PublicRoute restricted={false} path='/note' component={Note} />
              <PublicRoute
                restricted={false}
                path='/how-login'
                component={HowLogin}
              />

              <PublicRoute restricted={true} path='/login' component={Login} />

              <PublicRoute
                restricted={false}
                path='/channel/:id'
                component={Channel}
                layout={HeadLayout}
              />
              <Redirect from='/channel' to='/' />
              
              <PrivateRoute
                path='/video'
                component={Video}
                layout={HeadLayout}
              />
              <PrivateRoute
                path='/results'
                component={Results}
                layout={HeadLayout}
              />

              <PublicRoute
                restricted={false}
                path='*'
                component={PageNotFound}
              />
            </Switch>
          </Router>
        </Snackbar>
      ) : (
        <p>Loading...</p>
      )}
    </IntlProvider>
  );
}

export default App;
