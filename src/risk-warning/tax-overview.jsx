import React from 'react';
import {hashHistory} from 'react-router';
import Menus from '../containers/menu/menu';
import RiskWarning from './risk-warning';

import styles from './tax-overview.css';


export default class TaxOverview extends React.Component {

    render() {
        return (
            <div className={styles.banner}>
                <div className={styles.menu}>
                    <Menus />
                </div>
                <div className={styles.bannerRight}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
