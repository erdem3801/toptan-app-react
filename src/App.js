import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { Routes } from './routes'

import Nav from './temp/Nav'
import Footer from './temp/Footer'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

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

const RouteWithNavbar = ({ component: Component, ...rest }) => {

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
        <RouteWithNavbar exact path={Routes.Dashboard.path} component={Dashboard} />


        <RouteWithoutNavbar exact path={Routes.Login.path} component={Login} />
      </Switch>



    </>
  );
}

