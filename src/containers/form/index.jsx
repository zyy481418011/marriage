import React from 'react';
import styles from './styles.css';

export const TextBox = ({size='big', icon=null, className='', style={}, ...other}) => {
  style = {...style};
  let textBoxClass = 'textBox';
  if (size == 'big') {
    textBoxClass += 'Big';
  } else if (size == 'small') {
    textBoxClass += 'Small';
  }
  if (icon != null) {
    style.backgroundImage = `url(${icon})`;
    textBoxClass += 'Icon';
  } else {
    textBoxClass += 'NoIcon';
  }
  return <input className={`${styles[textBoxClass]} ${className}`} style={style} {...other} />;
};

export const TextArea = ({className='', ...other}) =>
  <textarea className={`${styles.textArea} ${className}`} {...other} />
;

export const Button = ({size='small', active=false, label, className='', style={}, ...other}) => {
  style = {...style};
  let buttonStyle;
  if (size == 'big') {
    buttonStyle = 'buttonBig';
  } else {
    buttonStyle = 'buttonSmall';
  }
  if (active) {
    buttonStyle+= '_active';
  }
  return <button className={`${styles[buttonStyle]} ${className}`} style={style} {...other}>{label}</button>;
};
