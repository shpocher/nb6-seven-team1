'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { GroupJoin } from '@/types/entities';
import Modal from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import Label from '@/lib/components/Label';
import Input from '@/lib/components/Input';
import { leaveGroupAction } from '../../actions';
import styles from './GroupLeaveButton.module.css';
import modalStyle from './modalStyle.module.css';
import Form from '@/lib/components/Form';

const cx = classNames.bind(styles);
const modalCx = classNames.bind(modalStyle);

const GroupLeaveModal = ({
  groupId,
  isOpen,
  onClose,
  onSubmit,
}: {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const { register, handleSubmit, formState, setError, reset } =
    useForm<GroupJoin>();

  const submit = async (data: GroupJoin) => {
    const result = await leaveGroupAction(groupId, data);
    if (result.status !== 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result.error.path as any) ?? 'root', {
        message: result.error.message,
      });
      return;
    }

    reset();
    onSubmit();
  };

  return (
    <Modal className={modalCx('modal')} isOpen={isOpen} onClose={onClose}>
      <h1 className={modalCx('title')}>그룹에서 나가시겠어요?</h1>
      <p className={modalCx('description')}>
        그룹을 참여할 때 등록했던 정보를 입력해 주세요. 그룹을 나갈 시, 해당
        닉네임으로 생성한 운동 기록은 모두 삭제됩니다.
      </p>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <div>
          <Label htmlFor="nickname" error={!!formState.errors.nickname}>
            닉네임
          </Label>
          <Input
            id="nickname"
            type="text"
            className={cx('input')}
            error={formState.errors.nickname?.message}
            {...register('nickname', { required: '닉네임을 입력해 주세요.' })}
          />
        </div>
        <div>
          <Label htmlFor="password" error={!!formState.errors.password}>
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            className={cx('input')}
            error={formState.errors.password?.message}
            {...register('password', { required: '비밀번호를 입력해 주세요.' })}
          />
        </div>
        <Button
          type="submit"
          className={cx('button')}
          disabled={!formState.isValid}
        >
          나가기
        </Button>
      </Form>
    </Modal>
  );
};

const GroupLeaveButton = ({
  className,
  groupId,
}: {
  className?: string;
  groupId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        className={cx('groupLeaveButton', className)}
        onClick={() => setIsOpen((s) => !s)}
      >
        나가기
      </Button>
      <GroupLeaveModal
        groupId={groupId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default GroupLeaveButton;
