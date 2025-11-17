import { HTMLProps } from 'react';
import classNames from 'classnames/bind';
import styles from './Label.module.css';

const cx = classNames.bind(styles);

interface LabelProps extends HTMLProps<HTMLLabelElement> {
  error?: boolean;
}

const Label = ({ error, ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={cx('label', {
        error,
      })}
    />
  );
};

export default Label;
