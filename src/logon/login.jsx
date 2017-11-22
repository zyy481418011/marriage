import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {login} from '../webapi';
import * as logonActions from './actions';
import {Button} from '../containers/form';
import {Footer} from '../footer/footer';
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
         
        </div>
        <div className={styles.bottom}>
          <p>从产品到服务的极具竞争力的应用新体系、真正的掌上税务厅，带领用户“可携带时代”</p>
          <p>“财税智库”将互联网技术与各行业、多角度的数据资源融合，运用数学统计分析原理与高效云计算平台和财务管理、经济交易、税务风险识别等涉税大数据分析应用技术、开发出既适合纳税人使用，又方便税务机关进行税收风险管理的系列智能化产品。</p>
        </div>
        <Footer/>
      </div>
    );
  }
}
export default connect(null, logonActions)(Login);
