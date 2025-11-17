import React from 'react';
import classNames from 'classnames/bind';
import styles from './Chip.module.css';

const cx = classNames.bind(styles);

type Appearance = 'default' | 'dark';

const Chip = ({
  className,
  appearance = 'default',
  children,
}: {
  className?: string;
  appearance?: Appearance;
  children: React.ReactNode;
}) => {
  return <div className={cx('chip', appearance, className)}>{children}</div>;
};

export default Chip;
