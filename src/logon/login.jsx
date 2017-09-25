import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {login} from '../webapi';
import * as logonActions from './actions';
import {Button} from '../containers/form';
import styles from './styles.css';
import logo from './img/logo.png';


class Login extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      user: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const {user, password} = this.state;
    if (!user) {
      alert('请输入用户名');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }
    const {saveToken, saveUserInfo} = this.props;
    try {
      const tokenInfo = await login(user, password);
      if (tokenInfo) {
        saveUserInfo(tokenInfo);
        saveToken(tokenInfo.accessToken);
        hashHistory.push('/home');
      }
    } catch (msg) {
      alert(msg.message);
    }
  }
  handleChange(e) {
    this.setState({[e.target.name]: e.target.value.split(' ').join('')});
  }
  render() {
    const {user, password} = this.state;
    return (
      <div className={styles.loginContent}>
        <img src={logo} className={styles.logo}/>
        <div className={styles.form}>
          <div className={styles.firstSubBox}><label>用户名：</label><input type="text" name="user" value={user} onChange={this.handleChange} /></div>
          <div className={styles.subBox}><label>密码：</label><input type="password" name="password" value={password} onChange={this.handleChange }/></div>
          <Button label="立即登录" onClick={this.handleSubmit} /><Button label="取消"/>
        </div>
      </div>
    );
  }
}
export default connect(null, logonActions)(Login);
