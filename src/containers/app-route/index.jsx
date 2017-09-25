import React from 'react';
import {connect} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from '../app';
import Home from '../../home/index';
import Login from '../../logon/login';
//风险警告
import RiskWarning from '../../risk-warning/risk-warning';
// 纳税总览
import TaxOverview from '../../risk-warning/tax-overview';
//图表页
import TaxChart from '../../chart/chart';
// 税务局
import TaxDepartment from '../../risk-warning/tax-department';
// 用户管理系统
import UserManagement from '../../user-management/user-management';
// 添加用户
import AddUser from '../../user-management/add-user';
// 修改用户
import UpdateUser from '../../user-management/update-user';
// 模型管理
import ModeManagement from '../../mode-management/mode-management';

const AppRoute = () => {
  
  return (
    <Router history={hashHistory} >
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="home" component={Home}>
          <IndexRoute component={ModeManagement} />
          <Route path="tax-overview" component={TaxOverview} >
            <IndexRoute component={TaxChart} />
            <Route path="tax-chart/:id" component={TaxChart} />
            <Route path="tax-department/:id" component={TaxDepartment} />
            <Route path="risk-warning/:id" component={RiskWarning} />
          </Route>
          <Route path="user-management" component={UserManagement} />
          <Route path="add-user" component={AddUser} />
          <Route path="update-user" component={UpdateUser} />
          <Route path="mode-management" component={ModeManagement} />
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
