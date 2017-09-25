import React from 'react';
import {hashHistory} from 'react-router';
import {Button} from '../containers/form';
import {Table, Tr, Th, Td, Page, One} from '../containers/table';
import {years} from '../constants.js';
import {addUser, getGroupTree} from '../webapi';
import {provinces, industries, accountings} from '../constants.js';
import styles from './add-user.css';

export default class AddUser extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      groupArray: [],
      defaultYear: 2016
    };
    this.selectYearChange = this.selectYearChange.bind(this);
  }

  componentDidMount() {
    this.groupDownload();
  }
  async groupDownload(){
    let groupArray = [];
    let groupTree = await getGroupTree();
    if (groupTree) {
      groupArray.push({id: groupTree.id,name: groupTree.name});
      if (groupTree.children.length > 0) {
        groupArray = groupArray.concat(groupTree.children);
      }
    }
    this.setState({groupArray});
  }
  selectYearChange() {

  }
  async addMember(){
    let user = {
      name: this.refs.name.value,
      realname: this.refs.realname.value,
      password: this.refs.password.value,
      group: this.refs.group.value,
      type: this.refs.type.value,
      perm_group: this.refs.permGroup.checked,
      perm_company: this.refs.permCompany.checked
    }
    if (!(user.name && user.realname && user.password)) {
      alert("请保持正确填写，用户名、密码或真实姓名不能为空");
      return;
    }
    let users = {"accounts":[]};
    users.accounts.push(user);
    try{
      let addNum = await addUser(users);
      if (addNum > 0) {
        alert("添加成功");
        hashHistory.goBack();
      }
    }catch(e){
      alert(e.message);
    }
  }
  render() {
    const {groupArray, defaultYear} = this.state;
    return (
      <div className={styles.carousel}>
        <div className={styles.formDiv}>
          <p className={styles.p}>添加新用户</p>
          <span className={styles.lableInputBox}><label>用户名：</label><input type="text" placeholder="请输入用户名" ref="name"/></span>
          <span className={styles.lableInputBox}><label>真实姓名：</label><input type="text" placeholder="请输入真实姓名" ref="realname"/></span>
          <span className={styles.lableInputBox}><label>初始密码：</label><input type="text" placeholder="请输入初始密码" ref="password"/></span>
          <span className={styles.lableInputBox}><label>所在组：</label>
            <select onChange={this.selectYearChange} className={styles.select} ref="group">
            {groupArray && groupArray.map(group => <option key={group.id} value={group.id}>{`${group.name}`}</option>)}
            </select>
            </span>
          <span className={styles.lableInputBox}><label>类型：</label>
            <select className={styles.select} ref="type">
              <option value="admin">管理员</option>
              <option value="normal">普通账户</option>
            </select>
          </span>
          <span className={styles.lableInputBox}><label>组管理权限：</label><input type="checkbox" ref="permGroup"/></span>
          <span className={styles.lableInputBox}><label>公司管理权限：</label><input type="checkbox" ref="permCompany"/></span>
          <div className={styles.btnDiv}>
            <Button label="添加" className={styles.btn} onClick={() => this.addMember()}/>
            <Button label="返回" className={styles.btn} onClick={() => hashHistory.goBack()}/>
          </div>
        </div>
      </div>
    );
  }
}
