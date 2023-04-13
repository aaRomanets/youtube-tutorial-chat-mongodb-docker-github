import React from "react";
import {connect} from "react-redux";
import {Route, Redirect, Switch} from "react-router-dom";

import {Auth,Home} from './pages/index';

const App = props =>  {
  //isAuth - флаг авторизации пользователя
  const {isAuth} = props;

  return (
    <div className="wrapper">
      <Switch>
        <Route 
          exact 
          path={["/signin","/signup","/signup/verify"]} 
          component={Auth}
        />
        <Route 
          path="/" 
          render={() => (isAuth ? <Home /> : <Redirect to="/signin" />)}
        />
      </Switch>
    </div>
  );
}

export default connect(({ user }) => ({ isAuth: user.isAuth }))(App);