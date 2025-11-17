import classNames from 'classnames/bind';
import styles from './Card.module.css';

const cx = classNames.bind(styles);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div className={cx(className, 'card')} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
