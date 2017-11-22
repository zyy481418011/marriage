import React from 'react';
import {getMyInfo} from '../webapi';
import styles from './footer.css';

export const Footer = ({})=> {
  return <div className={styles.foot}>
          Copyright @ 金税桥税务师事务所有限公司 &nbsp;
          <a className={styles.a} href="http://www.zgcszkw.com">www.zgcszkw.com</a> &nbsp; 京ICP备07504281号-1
         </div>
};
