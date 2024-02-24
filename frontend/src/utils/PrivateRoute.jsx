import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Auth';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    { ...rest }
    render={ (props) =>
      getToken() ? <Component { ...props } /> : <Redirect to="/login" />
    }
  />
);

export default PrivateRoute;
