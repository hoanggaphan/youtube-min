import Snackbar from 'components/Snackbar';
import { createBrowserHistory } from 'history';
import { ProvideAuth, useInitClient } from 'hooks/useAuth';
import BasicLayout from 'layouts/BasicLayout';
import React, { Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import PublicRoute from 'routes/PublicRoute';

TopBarProgress.config({
  barColors: {
    '0': '#ff0000',
    '1.0': '#ff0000',
  },
  shadowBlur: 5,
});

const Trending = React.lazy(() => import('pages/Trending'));
const Channel = React.lazy(() => import('pages/Channel'));
const HowLogin = React.lazy(() => import('pages/HowLogin'));
const Login = React.lazy(() => import('pages/Login'));
const Note = React.lazy(() => import('pages/Note'));
const PageNotFound = React.lazy(() => import('pages/NotFound'));
const Results = React.lazy(() => import('pages/Results'));
const Video = React.lazy(() => import('pages/Video'));
const LikeDislike = React.lazy(() => import('pages/LikeDislike'));

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
                    '/like',
                    '/dislike',
                  ]}
                >
                  <BasicLayout>
                    {/* Use separate suspense for each layout */}
                    <Suspense fallback={<TopBarProgress />}>
                      <Switch>
                        <Redirect exact from='/' to='/trending' />
                        {/* If you use homepage, remove redirect */}
                        {/* <PublicRoute exact path='/' component={Home} /> */}

                        <PublicRoute path='/trending' component={Trending} />
                        <PublicRoute path='/channel/:id' component={Channel} />
                        <Redirect from='/channel' to='/' />
                        <PublicRoute path='/video' component={Video} />
                        <PublicRoute path='/results' component={Results} />

                        <PublicRoute
                          path='/like'
                          component={() => <LikeDislike rating='like' />}
                        />
                        <PublicRoute
                          path='/dislike'
                          component={() => <LikeDislike rating='dislike' />}
                        />

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
