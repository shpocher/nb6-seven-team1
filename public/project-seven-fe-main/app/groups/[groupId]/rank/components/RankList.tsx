import classNames from 'classnames/bind';
import Card from '@/lib/components/Card';
import { Rank } from '@/types/entities';
import formatTime from '@/lib/formatTime';
import styles from './RankList.module.css';

const cx = classNames.bind(styles);

const RankItem = ({ order, rank }: { order: number; rank: Rank }) => {
  return (
    <Card
      className={cx('row', {
        isTopRank: order <= 3,
      })}
    >
      <div className={cx('rankColumn')}>{order}등</div>
      <div className={cx('nicknameColumn')}>{rank.nickname}</div>
      <div className={cx('recordCountColumn')}>{rank.recordCount}개의 기록</div>
      <div className={cx('recordTimeColumn')}>{formatTime(rank.recordTime)}</div>
    </Card>
  );
};

const RankList = ({ ranks }: { ranks: Rank[] }) => {
  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <div className={cx('rankColumn')}>랭킹</div>
        <div className={cx('nicknameColumn')}>닉네임</div>
        <div className={cx('recordCountColumn')}>누적 기록 수</div>
        <div className={cx('recordTimeColumn')}>누적 시간</div>
      </div>
      <ol className={cx('ranks')}>
        {ranks.map((rank, i) => (
          <li key={rank.participantId}>
            <RankItem rank={rank} order={i + 1} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RankList;
