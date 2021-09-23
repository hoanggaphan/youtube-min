import Snackbar from 'components/Snackbar';
import { createBrowserHistory } from 'history';
import { ProvideAuth, useInitClient } from 'hooks/useAuth';
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
import PublicRoute from 'routes/PublicRoute';

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

const defaultLocale = window.navigator.language;

function App() {
  const { initialized } = useInitClient();

  return (
    <IntlProvider locale={defaultLocale}>
      <Snackbar>
        {initialized ? (
          <ProvideAuth>
            <Router history={history}>
              <Switch>
                <PublicRoute
                  exact
                  path='/'
                  component={Home}
                  layout={HeadLayout}
                />
                <PublicRoute path='/note' component={Note} />
                <PublicRoute path='/how-login' component={HowLogin} />
                <PublicRoute
                  restricted={true}
                  path='/login'
                  component={Login}
                />
                <PublicRoute
                  path='/channel/:id'
                  component={Channel}
                  layout={HeadLayout}
                />
                <Redirect from='/channel' to='/' />
                <PublicRoute
                  path='/video'
                  component={Video}
                  layout={HeadLayout}
                />

                <PublicRoute
                  path='/results'
                  component={Results}
                  layout={HeadLayout}
                />

                <PublicRoute path='*' component={PageNotFound} />
              </Switch>
            </Router>
          </ProvideAuth>
        ) : (
          <p>Loading...</p>
        )}
      </Snackbar>
    </IntlProvider>
  );
}

export default App;
