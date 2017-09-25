import React from 'react';
import styles from './styles.css';

let bor = '';
export const Table = ({children, border='', className='', ...other}) => {
  bor = border;
  return <table className={`${styles.table} ${className}`} {...other} cellSpacing="0" cellPadding="0">
    <tbody>
      {children}
    </tbody>
  </table>;
};

export const Tr = ({children, className='', ...other}) =>
  <tr className={`${styles.tr} ${className} ${styles[`border${bor}`]}`} {...other}>
    {children}
  </tr>
;

export const Th = ({children, className='', ...other}) =>
  <th className={`${styles.th} ${className}`} {...other}>
    {children}
  </th>
;

export const Td = ({children, className='', ...other}) =>
  <td className={`${styles.td} ${className}`} {...other}>
    {children}
  </td>
;

export const Page = ({children, className='', ...other}) => <ul className={`${styles.page} ${className}`} {...other}>
  {children}
</ul>
;

export const One = ({num='', active=false, className='', ...other}) => {
  let one = 'one';
  if (active) {
    one += '_active';
  }
  return <li className={`${styles[one]} ${className}`} {...other}>
    {num}
  </li>;
}
;
