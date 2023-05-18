import React from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from '../routes';

class Auth extends React.Component {
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/') {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  render() {
    return (
      <>
        <Switch>{this.getRoutes(routes)}</Switch>
      </>
    );
  }
}

export default Auth;
