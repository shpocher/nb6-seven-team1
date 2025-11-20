import { HTMLProps } from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.css';
import Link, { LinkProps } from 'next/link';

const cx = classNames.bind(styles);

type Appearance = 'default' | 'minimal';

type Sizes = 'small' | 'default';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  type: 'button' | 'submit' | 'reset';
  appearance?: Appearance;
  sizes?: Sizes;
}

interface LinkButtonProps
  extends LinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  className?: string;
  appearance?: Appearance;
  sizes?: Sizes;
  children: React.ReactNode;
}

const Button = ({
  className,
  appearance = 'default',
  sizes = 'default',
  type,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      {...props}
      className={cx('button', appearance, sizes, className)}
    />
  );
};

export const LinkButton = ({
  className,
  appearance = 'default',
  sizes = 'default',
  ...props
}: LinkButtonProps) => {
  return (
    <Link
      {...props}
      className={cx('button', 'link', appearance, sizes, className)}
    />
  );
};

export default Button;
