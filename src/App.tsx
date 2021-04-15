import { ProvideAuth } from 'hooks/use-auth';
import Channel from 'pages/Channel';
import Home from 'pages/Home';
import Login from 'pages/Login';
import PageNotFound from 'pages/PageNotFound';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from 'routes/auth';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <ProtectedRoute exact path='/' component={Login} />
          <ProtectedRoute path='/home' component={Home} />
          <ProtectedRoute path='/:id' component={Channel} />
          <Route path='*' component={PageNotFound} />
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
