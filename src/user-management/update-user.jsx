import React from 'react';
import {hashHistory} from 'react-router';
import {Button} from '../containers/form';
import {years} from '../constants.js';
import {getMyInfo, getUserInfoById, getGroupTree, updateUser, updateUserById} from '../webapi';
import {provinces, industries, accountings} from '../constants.js';
import styles from './add-user.css';

export default class UpdateUser extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      admin:false,
      groupArray: [],
      username: '',
      realname : '',
      pass_old: '',
      password: '',
      perm_group: '',
      perm_company: '',
      type: '',
      group: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    console.log(this.props.location.query.id);
    if (this.props.location.query.id) {
      this.loadOtherMember(this.props.location.query.id);
    }else{
      this.loadUserInfo();
    }
    this.loadGroup();
  }
  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async loadGroup(){
    try{
      let groupArray = [];
      let groupTree = await getGroupTree();
      if (groupTree) {
        groupArray.push({id: groupTree.id,name: groupTree.name});
        if (groupTree.children.length > 0) {
          groupArray = groupArray.concat(groupTree.children);
        }
      }
      this.setState({groupArray});
    }catch(e){
      alert(e.message);
    }
  }
  async loadOtherMember(id){
    try{
      let userInfo = await getUserInfoById(id);
      this.setState({
        admin:true,
        username: userInfo.name,
        realname: userInfo.realname,
        password: '',
        perm_group: userInfo.permGroup,
        perm_company: userInfo.permCompany,
        type: userInfo.type,
        group: userInfo.group.id
      });
    }catch(e){
      alert(e.message);
    }
  }
  async loadUserInfo(){
    try{
      let userInfo = await getMyInfo();
      this.setState({
        username: userInfo.name,
        realname: userInfo.realname,
        pass_old: '',
        password: '',
        perm_group: userInfo.permGroup,
        perm_company: userInfo.permCompany,
        type: userInfo.type,
        group: userInfo.group.id
      });
    }catch(e){
      alert(e.message);
    }
  }
  async updateUserInfo(){
    if (password == '') {
      alert('密码不能为空');
      return;
    }
    const {admin, password, perm_group, perm_company, type, group, pass_old} = this.state;
    try{
      let update;
      if (admin) {
        update = await updateUserById(this.props.location.query.id, password, perm_group, perm_company, type, group);
      }else{
        update = await updateUser(password, perm_group, perm_company, type, group, pass_old);
      }
      if (update==null) {
        alert("更新成功");
      }
    }catch(e){
      alert(e.message);
    }
  }
  render() {
    const {admin, groupArray, username, realname, password, perm_group, perm_company, type, group, pass_old} = this.state;
    return (
      <div className={styles.carousel}>
        <div className={styles.formDiv}>
          <p className={styles.p}>修改用户信息</p>
          {!admin && <span className={styles.lableInputBox}><label>旧密码：</label><input type="text" placeholder="请输入旧密码" name="pass_old" value={pass_old} onChange={this.handleChange}/></span>}
          <span className={styles.lableInputBox}><label>新密码：</label><input type="text" placeholder="请输入新密码" name="password" value={password} onChange={this.handleChange}/></span>
          <span className={styles.lableInputBox}><label>用户名：</label><input type="text" placeholder="请输入用户名" name="username" value={username} onChange={this.handleChange} disabled/></span>
          <span className={styles.lableInputBox}><label>真实姓名：</label><input type="text" placeholder="请输入真实姓名" name="realname" value={realname} onChange={this.handleChange} disabled/></span>
          <span className={styles.lableInputBox}><label>所在组：</label>
            <select onChange={this.handleChange} className={styles.select} value={group} name="group">
              {groupArray && groupArray.map(group => <option key={group.id} value={group.id}>{`${group.name}`}</option>)}
            </select>
          </span>
          {/*<span className={styles.lableInputBox}><label>类型：</label>
                      <select className={styles.select}>
                        <option value="admin">管理员</option>
                        <option value="normal">普通账户</option>
                      </select>
                    </span>*/
                  }
          <span className={styles.lableInputBox}><label>组管理权限：</label>
            <select className={styles.select} name="perm_group" value={perm_group} onChange={this.handleChange} disabled={!admin}>
                <option value="true">有</option>
                <option value="false">无</option>
            </select>
          </span>
          <span className={styles.lableInputBox}><label>公司管理权限：</label>
            <select className={styles.select} name="perm_company" value={perm_company} onChange={this.handleChange} disabled={!admin}>
                <option value="true">有</option>
                <option value="false">无</option>
            </select>
          </span>
          <div className={styles.btnDiv}>
            <Button label="确定" className={styles.btn} onClick={() => this.updateUserInfo()}/>
            <Button label="返回" className={styles.btn} onClick={() => hashHistory.goBack()}/>
          </div>
        </div>
      </div>
    );
  }
}
