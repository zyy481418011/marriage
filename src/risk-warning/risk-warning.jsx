import React from 'react';
import {Button} from '../containers/form';
import {getTaxType, getCompanyTaxReport} from '../webapi';
import styles from './risk-warning.css';

export default class RiskWarning extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      taxTypes: [],
      taxType: null,
      riskReport: {}
    };
    this.renderReport = this.renderReport.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.load();
  }

  async load(){
    const taxTypes = await getTaxType();
    const riskReport = await getCompanyTaxReport(this.props.params.id, this.state.taxType);
    this.setState({taxTypes, riskReport});
  }

    handleClick(){
      this.setState({taxType: this.refs.typeName.value}, this.load);
  }
  render() {
    const {taxTypes, riskReport} = this.state;
    return (
      <div className={styles.carousel}>
        <div className={styles.search}>
            <span>
                <label className={styles.label}>税种：</label>
                    <select className={styles.select} ref="typeName">
                        <option value="">请选择</option>
                        {taxTypes.map(type =>
                        <option value={type.name} key={type.id}>{type.name}</option>)}
                    </select>
            </span>
            <Button label="查询" onClick={this.handleClick} />
        </div>
        <div className={styles.tableDiv}>
          {riskReport.info && this.renderReport(riskReport) }
        </div>
      </div>
    );
  }
  renderReport({info, totalTax}){
      const yearReports = Object.keys(info).reduce((item, year) => {
        item.push(this.renderYearReport(year, info[year]));
        return item;
      }, []);

    return (
        <table className={styles.table} cellSpacing="0" cellPadding="0">
          <thead>
          <tr className={`${styles.tr} ${styles.borderall}`}>
            <th  className={styles.th}>年度</th>
            <th  className={styles.th}>月份</th>
            <th  className={styles.th}>编号</th>
            <th  className={styles.th}>税种</th>
            <th  className={styles.th}>描述</th>
            <th  className={styles.th}>税款</th>
          </tr>
          </thead>
          {yearReports}
          <tbody>
          <tr  className={`${styles.tr} ${styles.borderall}`}>
            <td colSpan={4} className={styles.td}>所有年度总计</td>
            <td colSpan={2} className={styles.td}>{totalTax.toFixed(2)}</td>
          </tr>
          </tbody>
        </table>
    )
  }

  renderYearReport(year, {detail, tax}) {
    return (
        <tbody key={year}>
        {detail.map((row, index)=>
            <tr key={index} className={`${styles.tr} ${styles.borderall}`}>
              {index == 0? <td rowSpan={detail.length + 1}  className={styles.td}>{year}</td>:null}
              <td className={styles.td}>{row.month.toFixed(0)}</td>
              <td className={styles.td}>{index + 1}</td>
              <td className={styles.td}>{row.type}</td>
              <td className={styles.td}>{row.desc}</td>
              <td className={styles.td}>{row.tax==0?'待核实':row.tax.toFixed(2)}</td>
            </tr>
        )}
        <tr className={`${styles.tr} ${styles.borderall}`}>
          <td colSpan={3} className={styles.td}>年度总计</td>
          <td colSpan={2} className={styles.td}>{tax.toFixed(2)}</td>
        </tr>
        </tbody>
    );
  }
}
