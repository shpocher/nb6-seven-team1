import { HTMLProps } from 'react';
import classNames from 'classnames/bind';
import styles from './Input.module.css';

const cx = classNames.bind(styles);

interface InputProps extends HTMLProps<HTMLInputElement> {
  search?: boolean;
  error?: string;
}

const Input = ({ className, search, error, ...props }: InputProps) => {
  return (
    <>
      <input
        {...props}
        className={cx('input', className, {
          search,
          error,
        })}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </>
  );
};

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = ({ className, error, ...props }: TextareaProps) => {
  return (
    <>
      <textarea className={cx('input', className, { error })} {...props} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </>
  );
};

export default Input;
