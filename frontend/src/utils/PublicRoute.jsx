import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Auth';

const PublicRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    { ...rest }
    render={ (props) =>
      getToken() ? <Redirect to="/dashboard" /> : <Component { ...props } />
    }
  />
);

export default PublicRoute;
