import Snackbar from 'components/Snackbar';
import { createBrowserHistory } from 'history';
import { ProvideAuth, useInitClient } from 'hooks/useAuth';
import BasicLayout from 'layouts/BasicLayout';
import React, { Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import { Redirect, Router, Switch, Route } from 'react-router-dom';
import PublicRoute from 'routes/PublicRoute';
import Trending from 'pages/Trending';

import TopBarProgress from 'react-topbar-progress-indicator';
TopBarProgress.config({
  barColors: {
    '0': '#ff0000',
    '1.0': '#ff0000',
  },
  shadowBlur: 5,
});

const Channel = React.lazy(() => import('pages/Channel'));
const HowLogin = React.lazy(() => import('pages/HowLogin'));
const Login = React.lazy(() => import('pages/Login'));
const Note = React.lazy(() => import('pages/Note'));
const PageNotFound = React.lazy(() => import('pages/NotFound'));
const Results = React.lazy(() => import('pages/Results'));
const Video = React.lazy(() => import('pages/Video'));

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
                <Route path={['/note', '/how-login', '/login']}>
                  {/* Use separate suspense for each layout */}
                  {/* <Layout1> */}
                    <Suspense fallback={<TopBarProgress />}>
                      <Switch>
                        <PublicRoute path='/note' component={Note} />
                        <PublicRoute path='/how-login' component={HowLogin} />
                        <PublicRoute
                          restricted={true}
                          path='/login'
                          component={Login}
                        />
                      </Switch>
                    </Suspense>
                  {/* </Layout1> */}
                </Route>

                {/* This Layout is last because it is used for the root "/" and will be greedy */}
                <Route
                  path={[
                    '/',
                    '/trending',
                    '/channel/:id',
                    '/channel',
                    '/video',
                    '/results',
                  ]}
                >
                  <BasicLayout>
                    {/* Use separate suspense for each layout */}
                    <Suspense fallback={<TopBarProgress />}>
                      <Switch>
                        <Redirect exact from='/' to='/trending' />
                        {/* If you use homepage, remove redirect */}
                        {/* <PublicRoute exact path='/' component={Home} /> */}

                        {/* Because the home page is not used, 
                            the Trending Page is usually the first to load,
                            , so i don't use code splitting for this page.  
                        */}
                        <PublicRoute path='/trending' component={Trending} />

                        <PublicRoute path='/channel/:id' component={Channel} />
                        <Redirect from='/channel' to='/' />
                        <PublicRoute path='/video' component={Video} />
                        <PublicRoute path='/results' component={Results} />
                        <PublicRoute path='*' component={PageNotFound} />
                      </Switch>
                    </Suspense>
                  </BasicLayout>
                </Route>
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
