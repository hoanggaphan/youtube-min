import Home from 'features/Home/Home';
import Login from 'features/Login/Login';
import { ProvideAuth } from 'hooks/use-auth';
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { ProtectedRoute } from 'routes/auth';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <ProtectedRoute exact path='/' component={Login} />
          <ProtectedRoute path='/home' component={Home} />
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;
