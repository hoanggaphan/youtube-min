import { ProvideAuth } from 'hooks/use-auth';
import Channel from 'pages/Channel';
import Home from 'pages/Home';
import Login from 'pages/Login';
import PageNotFound from 'pages/NotFound';
import Video from 'pages/Video';
import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { ProtectedRoute } from 'routes/auth';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

function App() {
  return (
    <ProvideAuth>
      <Router history={history}>
        <Switch>
          <ProtectedRoute exact path='/' component={Login} />
          <ProtectedRoute path='/home' component={Home} />
          <ProtectedRoute path='/channel/:id' component={Channel} />
          <ProtectedRoute path='/video' component={Video} />
          <Route path='*' component={PageNotFound} />
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
