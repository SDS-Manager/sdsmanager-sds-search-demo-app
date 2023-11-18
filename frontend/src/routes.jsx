import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './pages/main/Main';
function Routes() {
  const page = (
    <Switch>
      <Route exact path="/" component={MainPage} />
    </Switch>
  );
  return <Router>{page}</Router>;
}

export default Routes;
