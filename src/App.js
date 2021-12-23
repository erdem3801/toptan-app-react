import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom' 
import { Routes } from './routes'
import Nav from './temp/Nav'
import Footer from './temp/Footer'
import { useSelector } from 'react-redux';

const RouteWithoutNavbar = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      <>
        <Component {...props} />
      </>
    )}
    />
  );
}
const RouteWithNavbar = ({ component: Component, auth, ...rest }) => {
  const user = useSelector(state => state.auth)
  if (auth && !user)
    return <Redirect to={'/login'} />
  return (
    <Route {...rest} render={props => (
      <>
        <Nav />
        <div className="content-wrapper">
          <Component {...props} />
        </div>
        {/* Control Sidebar */}
        <aside className="control-sidebar control-sidebar-dark">
          {/* Control sidebar content goes here */}
        </aside>
        {/* /.control-sidebar */}
        <Footer />
      </>
    )}
    />
  );
};
export default () => {
  return (
    <>
      <Switch>
        {
          Routes.map(route => {
            if (route.navbar)
              return <RouteWithNavbar exact={route.exact} path={Routes.path} auth={route.auth} component={route.component} />
            else
              return <RouteWithoutNavbar exact={route.exact} path={Routes.path} auth={route.auth} component={route.component} />
          })
        }
      </Switch>
    </>
  );
}
