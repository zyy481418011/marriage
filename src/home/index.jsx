import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import * as logonAction from '../logon/actions';
import {getMyInfo} from '../webapi';
import styles from './styles.css';
import logo from './img/logo.png';
import store from '../store';

class Home extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userType: '',
      title: '纳税预览',
      mod1: true,
      mod2: false,
      mod3: false,
      mod4: false,
    };
    this.clickHandler = this.clickHandler.bind(this);
  }
  componentDidMount() {
    if (this.props.location.query.mod) {
      this.setState({
        title: this.props.location.query.title,
        mod1: false,
        mod2: false,
        mod3: false,
        mod4: false
      });
      this.setState({[this.props.location.query.mod] : true});
    }
    this.load();
  }
  async load(){
    try{
      let userInfo = await getMyInfo();
      this.setState({userType: userInfo.type})
    }catch(e){
      alert(e.message);
    }
  }
  clickHandler(path, title, mod, event){
    this.setState({
      title,
      mod1: false,
      mod2: false,
      mod3: false,
      mod4: false
    });
    this.setState({[mod]: true});
    hashHistory.push(`${path}?mod=${mod}&title=${title}`);
  }
  logout(){
    this.props.logout();
    hashHistory.push('/login');
  }
  render() {
    const {title, mod1, mod2, mod3, mod4, userType} = this.state;
    return (
      <div>
        <div className={styles.top}>
          <div className={styles.topMenu}>
            <img src={logo}/>
            <div className={styles.menu}>
              <span className={mod1 ? styles.mod2Hover : styles.mod2} name='mod1' onClick={this.clickHandler.bind(this, '/home/mode-management', '模型管理', 'mod1')}/>
              <span className={mod2 ? styles.mod3Hover : styles.mod3} name='mod2' onClick={this.clickHandler.bind(this, '/home/tax-overview', '风险预警', 'mod2')}/>
              <span className={mod3 ? styles.mod4Hover : styles.mod4} name='mod3' onClick={this.clickHandler.bind(this, `${userType=='admin'?'/home/user-management':'/home/update-user'}`, '用户管理', 'mod3')}/>
              <span className={mod4 ? styles.mod5Hover : styles.mod5} name='mod4' onClick={() => this.logout()}/>
            </div>
          </div>
          <div className={styles.title}>{title}</div>
        </div>
        {this.props.children}
        <div className={styles.foot}>
          Copyright @ 金税桥税务师事务所有限公司 &nbsp;
          <a className={styles.a} href="http://www.zgcszkw.com">www.zgcszkw.com</a> &nbsp; 京ICP备07504281号-1
        </div>
      </div>
    );
  }
}

export default connect(null, logonAction)(Home);
