import React from 'react';
import {hashHistory} from 'react-router';
import store from '../store';
import { Pagination } from 'antd';
import {Button} from '../containers/form';
import {Table, Tr, Th, Td} from '../containers/table';
import {getGroupReport} from '../webapi';
import styles from './tax-department.css';


export default class TaxOverview extends React.Component {
    constructor(...args) {
        super(...args);
        this.pageSize = 10;
        this.state = {
            reportList: [],
            name: null,
            subTaxpayerNum: null,
            subRegisterNum: null,
            defaultNum: 1,
            page: 0,
            pageNum: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.downLoadReport = this.downLoadReport.bind(this);
    }

    componentDidMount() {
        if(this.props.params.id){
            this.reload(this.props.params.id, this.state.page);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.params.id) {
            if (this.refs.queryName.value.length != 0) {
                this.refs.queryName.value = '';
            }
            if (this.refs.queryNsrsbh.value.length != 0) {
                this.refs.queryNsrsbh.value = '';
            }
            if (this.refs.queryAdmin.value.length != 0) {
                this.refs.queryAdmin.value = '';
            }
            this.setState({
                name: null,
                subTaxpayerNum: null,
                subRegisterNum: null
            }, () => this.reload(newProps.params.id, 0));
        }
    }
    async reload(id, page){
        const {name, subTaxpayerNum, subRegisterNum} = this.state;
        const newReport = await getGroupReport(id, page*this.pageSize, this.pageSize, {name, subTaxpayerNum, subRegisterNum});
        this.setState({reportList: newReport, pageNum: Math.ceil(newReport.count/this.pageSize)})
    }
    handleSearch(){
        const query = {};
        if (this.refs.queryAdmin.value.length != 0) {
            query.subRegisterNum = this.refs.queryAdmin.value;
        } else {
            query.subRegisterNum = null;
        }
        if (this.refs.queryNsrsbh.value.length != 0) {
            query.subTaxpayerNum = this.refs.queryNsrsbh.value;
        } else {
            query.subTaxpayerNum = null;
        }
        if (this.refs.queryName.value.length != 0) {
            query.name = this.refs.queryName.value;
        } else {
            query.name = null;
        }
        this.setState(query, () => this.reload(this.props.params.id, 0));
    }
    downLoadReport(id){
        const accessToken = store.getState().logon.accessToken;
        window.open(`${__API_BASE__}/export/company/csv/${id}?access_token=${accessToken}`)
    }
    render() {
        const {reportList, defaultNum, pageNum} = this.state;
        return (
            <div className={styles.right}>
                <div className={styles.search}>
                    <span><label className={styles.label}>公司名称：</label><input type="text" className={styles.text} ref="queryName" /></span>
                    <span><label className={styles.label}>纳税人识别号：</label><input type="text" className={styles.text} ref="queryNsrsbh" /></span>
                    <span><label className={styles.label}>登记序号：</label><input type="text" className={styles.text} ref="queryAdmin" /></span>
                    <Button label="查询" onClick={this.handleSearch}/>
                </div>
                <div className={styles.tableDiv}>
                    <Table border="all">
                        <Tr>
                            <Th>序号</Th>
                            <Th>公司名称</Th>
                            <Th>纳税人识别号</Th>
                            <Th>登记序号</Th>
                            <Th>排查税款(单位:元)</Th>
                            <Th>查看</Th>
                            <Th>操作</Th>
                        </Tr>
                        {reportList.report && reportList.report.map((report, index) =>
                            <Tr key={report.subId}>
                                <Td>{index+1}</Td>
                                <Td>{report.subName}</Td>
                                <Td>{report.subTaxpayerNum}</Td>
                                <Td>{report.subRegisterNum}</Td>
                                <Td>{report.totalTax.toFixed(2)}</Td>
                                <Td>
                                    <a className={styles.delete} onClick={() => hashHistory.push(`/home/tax-overview/risk-warning/${report.subId}`)}>税款排查报告</a>
                                </Td>
                                <Td>
                                    <a className={styles.downLoad} onClick={() => this.downLoadReport(report.subId)}>导出</a>
                                </Td>
                            </Tr>
                        )}
                    </Table>
                    <Pagination onChange={this.handleChange} defaultCurrent={defaultNum} total={pageNum*10} className={styles.page} />
                </div>
            </div>
        );
    }
    handleChange(page){
        this.reload(this.props.params.id, page-1);
    }
}