'use client';

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import Card from './Card';
import styles from './Modal.module.css';

const cx = classNames.bind(styles);

const Modal = ({
  className,
  isOpen,
  children,
  onClose,
}: {
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) => {

  const preventClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (isOpen) {
      lockScroll();

      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root')!;

  return ReactDOM.createPortal(
    <div className={cx('backdrop')} onClick={onClose}>
      <Card className={cx('modal', className)} onClick={preventClose}>
        {children}
      </Card>
    </div>,
    modalRoot
  );
};

export default Modal;
