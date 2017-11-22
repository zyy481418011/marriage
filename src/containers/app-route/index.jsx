import React from 'react';
import {connect} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from '../app';
import Home from '../../home/index';
import Login from '../../logon/login';
// 用户管理系统
import UserManagement from '../../user-management/user-management';

const AppRoute = () => {
  
  return (
    <Router history={hashHistory} >
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="home" component={Home}>
          <IndexRoute component={UserManagement} />
          <Route path="user-management" component={UserManagement} />
        </Route>
        <Route path="login" component={Login} />
      </Route>
    </Router>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.logon.checkingTokens
  };
}

export default connect(mapStateToProps)(AppRoute);
