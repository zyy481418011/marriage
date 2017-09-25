import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import AppRoute from './containers/app-route';
import DevTools from './containers/dev-tools';
import store from './store';
import {getTokenFromStorage} from './logon/actions';
import 'antd/dist/antd.css';

// 恢复登录状态
store.dispatch(getTokenFromStorage());

ReactDOM.render(
  <Provider store={store}>
    <div>
      <AppRoute />
      {__DEVTOOLS__ && <DevTools /> }
    </div>
  </Provider>,
  document.getElementById('app')
);
