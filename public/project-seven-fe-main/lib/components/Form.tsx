import { FormHTMLAttributes } from 'react';
import classNames from 'classnames/bind';
import styles from './Form.module.css';

const cx = classNames.bind(styles);

type FormProps = {
  error?: string;
} & FormHTMLAttributes<HTMLFormElement>;

const Form = ({ error, children, ...props }: FormProps) => {
  return (
    <>
      <form {...props}>{children}</form>
      {error && <div className={cx('errorMessage', { error })}>{error}</div>}
    </>
  );
};

export default Form;
