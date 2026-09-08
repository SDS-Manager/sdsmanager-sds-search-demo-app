import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import MainPage from './pages/main/Main';

// The Swagger UI at /docs is served by the FastAPI backend, outside this
// SPA — a react-router <Redirect> cannot reach it, so leave the app via
// the browser location instead.
function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

function Routes() {
  const page = (
    <Switch>
      <Route exact path="/" component={MainPage} />
      {/* /api/docs was shared with API customers as a docs link; it lands
          in the SPA shell and used to render a blank page. Send it to the
          real Swagger UI. */}
      <Route path="/api/docs" render={() => <ExternalRedirect to="/docs" />} />
      {/* Any other unknown path: main page instead of a blank screen. */}
      <Redirect to="/" />
    </Switch>
  );
  return <Router>{page}</Router>;
}

export default Routes;
