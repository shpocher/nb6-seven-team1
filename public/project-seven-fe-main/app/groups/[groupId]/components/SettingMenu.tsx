'use client';

import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import settingIcon from '@/public/assets/settings.svg';
import styles from './SettingMenu.module.css';
import Link from 'next/link';
import GroupDeleteButton from './GroupDeleteButton';
import Card from '@/lib/components/Card';

const cx = classNames.bind(styles);

const SettingMenu = ({
  className,
  groupId,
}: {
  className: string;
  groupId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cx('wrapper', className)}>
      <Image
        className={cx('settingIcon')}
        src={settingIcon}
        alt="setting"
        width={24}
        height={24}
        onClick={() => setIsOpen((v) => !v)}
      />
      {isOpen && (
        <div className={cx('popover')}>
          <Card className={cx('options')}>
            <Link className={cx('option')} href={`/groups/${groupId}/edit`}>
              그룹 수정
            </Link>
            <GroupDeleteButton className={cx('option')} groupId={groupId} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingMenu;
