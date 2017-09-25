import React from 'react';
import Chart from 'rc-echarts';
import store from '../store';
import {getGroupTaxTypes, getGroupPipelines, getUserInfo} from '../webapi';
import {Button} from '../containers/form';
import styles from './chart.css';

export default class TaxChart extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            groupId: '',
            taxTypes: [],
            pipelines: [],
            dataName: [],
            pipelineArray:[],
            yearBefore: null,
            yearAfter: null,
            defaultYear: 2017,
        };
        this.yearChange = this.yearChange.bind(this);
        this.downLoadReport = this.downLoadReport.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    componentDidMount() {
        this.load();
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            groupId: newProps.params.id
        });
        this.load();
    }
    async load(){
        const {yearBefore, yearAfter} = this.state;
        const userInfo = await getUserInfo();
        const groupId = userInfo.group.id;
        this.setState({groupId});
        const taxTypes = await getGroupTaxTypes(this.state.groupId, {yearBefore, yearAfter});
        const dataName = [];
        taxTypes.length> 0 && taxTypes.map(item => dataName.push(item.name));
        const pipelines = await getGroupPipelines(this.state.groupId, {yearBefore, yearAfter});

        const dataValues = pipelines.dataValues;
        let pipelineArray = [];

        if(dataValues){
            for(let key in dataValues){
                pipelineArray.push({name: key, type:'line',smooth:true,itemStyle: {normal: {areaStyle: {type: 'default'}}},data: dataValues[key]})
            }
            this.setState({pipelineArray});
        }
        this.setState({taxTypes, pipelines, dataName});
    }
    async yearChange(e) {
        this.setState({defaultYear: e.target.value});
    }
    downLoadReport(){
        const accessToken = store.getState().logon.accessToken;
        window.open(`${__API_BASE__}/export/group/csv/${this.state.groupId}?access_token=${accessToken}`)
    }
    handleSearch(){
        this.setState({yearBefore: this.refs.beforeVal.value, yearAfter: this.refs.afterVal.value}, this.load);
    }
    render() {
        const {taxTypes, pipelines, dataName, pipelineArray, defaultYear} = this.state;
        const years=[2017, 2016, 2015, 2014, 2013];
        let xAxisData = [];
        let legendData = [];
        if (pipelines.dataX) {
            xAxisData = pipelines.dataX;
            legendData = pipelines.dataNames;
        }

        const pieOption = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: dataName
            },
        };
        const lineOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '1%',
                containLabel: true
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ]
        };

        return (
            <div className={styles.carousel}>
                <div className={styles.block1}>
                <span>
                    <label className={styles.label}>税款所属期 自：</label>
                    <select className={styles.select} ref="beforeVal" >{years.map(year => <option value={year} key={year}>{`${year}年度`}</option>)}</select>
                </span>
                    <span>
                    <label className={styles.label}> 至：</label>
                    <select className={styles.select} ref="afterVal" >{years.map(year => <option value={year} key={year}>{`${year}年度`}</option>)}</select>
                </span>
                    <Button label="查询" onClick={this.handleSearch}/>
                    <Button label="导出" onClick={this.downLoadReport}/>
                </div>
                <div className={styles.block2}>
                    <label className={styles.chartName}>税种占比分析</label>
                    <Chart {...pieOption}>
                        <Chart.Pie
                            name='访问来源'
                            type='pie'
                            radius='55%'
                            center={['50%', '60%']}
                            data={taxTypes}
                            itemStyle={{
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }} />
                    </Chart>
                </div>
                <div className={styles.block3}>
                    <label className={styles.chartName}>各地收入分析</label>
                    <Chart {...lineOption} >
                        {pipelineArray.map((item, i) => <Chart.Line key={i} {...item} />)}
                    </Chart>
                </div>

            </div>
        );
    }
}