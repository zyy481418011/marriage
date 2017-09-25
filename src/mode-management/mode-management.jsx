import React from 'react';
import { Pagination } from 'antd';
import {Button} from '../containers/form';
import {Table, Tr, Th, Td} from '../containers/table';
import {getTaxType, getIndustry, getPipeline} from '../webapi';
import styles from './mode-management.css';

export default class ModeManagement extends React.Component {
  constructor(...args) {
    super(...args);
    this.pageSize = 10;
    this.state = {
      taxTypes: [],
      industries: [],
      pipelines: [],
      taxType: null,
      industryName: null,
      defaultNum: 1,
      page: 0,
      pageNum: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.reload(this.state.page);
  }
  async reload(page){
    const {taxType, industryName} = this.state;
    const taxTypes = await getTaxType();
    const industries = await getIndustry();
    const pipelines = await getPipeline(page*this.pageSize, this.pageSize, {taxType, industryName});
    this.setState({taxTypes, industries, pipelines, pageNum: Math.ceil(pipelines.count/this.pageSize)});
  }
  handleSearch(){
    const query = {};
    if (this.refs.queryType.value.length != 0) {
      query.taxType = this.refs.queryType.value;
    } else {
      query.taxType = null;
    }
    if (this.refs.queryCode.value.length != 0) {
      query.industryName = this.refs.queryCode.value;
    } else {
      query.industryName = null;
    }
    this.setState(query, () => this.reload(0));
  }

  render() {
    const {taxTypes, industries, pipelines, defaultNum, pageNum} = this.state;
    return (
      <div className={styles.carousel}>
        <div className={styles.searchDiv}>
          <div className={styles.search}>
            模型税种分类：
            <select className={styles.select} ref="queryType">
              <option value="">请选择</option>
              {taxTypes.map(type =>
                <option value={type.name} key={type.id}>{type.name}</option>)}
            </select>
          </div>
          <div className={styles.search}>
            模型行业分类：
            <select className={styles.select} ref="queryCode">
              <option value="">请选择</option>
              {industries.map(industry =>
                <option value={industry.name} key={industry.id}>{industry.name}</option>)}
            </select>
            <Button label="查询" className={styles.btn}  onClick={this.handleSearch}/>
          </div>
        </div>
        <div className={styles.tableDiv}>
          <Table border="all">
            <Tr>
              <Th>序号</Th>
              <Th>模型名称</Th>
              <Th>税种</Th>
              <Th>分类</Th>
            </Tr>
            {pipelines.pipeline && pipelines.pipeline.map((pipeline, index) =>
                <Tr key={pipeline.id}>
                  <Td>{index+1}</Td>
                  <Td>{pipeline.name}</Td>
                  <Td>{pipeline.taxType}</Td>
                  <Td>{pipeline.industryName}</Td>
                </Tr>
            )}
          </Table>
          <Pagination onChange={this.handleChange} defaultCurrent={defaultNum} total={pageNum*10} className={styles.page} />
        </div>
      </div>
    );
  }
  handleChange(page){
    this.reload(page-1);
  }
}
