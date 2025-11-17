'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { GroupJoin } from '@/types/entities';
import Modal from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import Form from '@/lib/components/Form';
import { joinGroupAction } from '../../actions';
import styles from './GroupJoinButton.module.css';
import modalStyles from './modalStyle.module.css';
import Label from '@/lib/components/Label';
import Input from '@/lib/components/Input';

const cx = classNames.bind(styles);
const modalCx = classNames.bind(modalStyles);

const GroupJoinModal = ({
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
  const { register, handleSubmit, setError, reset, formState } =
    useForm<GroupJoin>();

  const submit = async (data: GroupJoin) => {
    const result = await joinGroupAction(groupId, data);
    if (result.status !== 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result.error.path as any) ?? 'root', {
        message: result.error.message,
      });
      return;
    }
    onSubmit();
    reset();
  };

  return (
    <Modal className={modalCx('modal')} isOpen={isOpen} onClose={onClose}>
      <h1 className={modalCx('title')}>그룹에 참여하시겠어요?</h1>
      <p className={modalCx('description')}>
        해당 그룹에서 사용할 닉네임과 비밀번호를 입력해 주세요.
      </p>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <input type="hidden" name="groupId" value={groupId} />
        <div>
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            type="text"
            className={cx('input')}
            error={formState.errors.nickname?.message}
            {...register('nickname', { required: '닉네임을 입력해 주세요.' })}
          />
        </div>
        <div>
          <Label htmlFor="password">비밀번호</Label>
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
          참여하기
        </Button>
      </Form>
    </Modal>
  );
};

const GroupJoinButton = ({
  className,
  groupId,
}: {
  className?: string;
  groupId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleJoinModalSubmit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        appearance="minimal"
        className={className}
        onClick={() => setIsOpen((s) => !s)}
      >
        참여하기
      </Button>
      <GroupJoinModal
        groupId={groupId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleJoinModalSubmit}
      />
    </>
  );
};

export default GroupJoinButton;
