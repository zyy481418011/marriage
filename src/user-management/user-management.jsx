import React from 'react';
import {hashHistory} from 'react-router';
import { Pagination } from 'antd';
import {Button} from '../containers/form';
import {Table, Tr, Th, Td} from '../containers/table';
import {getUserList, delUser} from '../webapi';
import {provinces, industries, accountings} from '../constants.js';
import styles from './user-management.css';

export default class UserManagement extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      users: [],
      defaultNum: 1,
      userTotal: 0
    };
  }

  componentDidMount() {
    this.load();
  }

  async load(){
    const users = await getUserList();
    this.setState({users, userTotal:users.length});
  }

  onShowSizeChange(value){
    // this.setState({defaultNum:value})
  }
  async deleteUser(id){
    try{
      let delInfo = await delUser(id);
      if (delInfo == null) {
        alert("删除成功");
      }
    }catch(e){
      alert(e.message);
    }
    this.load();
  }
  render() {
    const {users, defaultNum, userTotal} = this.state;
    return (
      <div className={styles.carousel}>
        <div className={styles.search}>
          {/*<input type="text" className={styles.text} placeholder="请输入关键字"/>
          <Button label="查询"/>*/}
          <Button label="添加用户" className={styles.addCompany} onClick={() => hashHistory.push('/home/add-user')}/>
        </div>
        <div className={styles.tableDiv}>
          <Table border="all">
            <Tr>
              <Th>用户名</Th>
              <Th>真实姓名</Th>
              <Th>类型</Th>
              <Th>组</Th>
              <Th>组管理权限</Th>
              <Th>企业管理权限</Th>
              <Th>操作</Th>
            </Tr>
            {users && users.map((user =>
                <Tr key={user.id}>
                  <Td>{/*<input type="checkbox"/>*/}{user.name}</Td>
                  <Td>{user.realname}</Td>
                  <Td>{user.type == 'admin' ? '管理员' : '普通用户'}</Td>
                  <Td>{user.group.name}</Td>
                  <Td>{user.permCompany ? '有' : '无'}</Td>
                  <Td>{user.permGroup ? '有' : '无'}</Td>
                  <Td>{/*<a className={styles.choose} onClick={() => hashHistory.push(`/home/update-user?id=${user.id}`)}>修改</a>*/} <a className={styles.delete} onClick={() => this.deleteUser(user.id)}>删除</a></Td>
                </Tr>
            ))}
          </Table>
          {/*<input type="checkbox" className={styles.selectAll}/>全选<Button label="批量删除"/>*/}
          <Pagination onChange={this.onShowSizeChange} defaultCurrent={defaultNum} total={userTotal} className={styles.page}/>
        </div>
      </div>
    );
  }
}
