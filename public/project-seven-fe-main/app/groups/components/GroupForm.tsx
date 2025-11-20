'use client';

import _ from 'lodash';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { Group, GroupCreate, GroupUpdate } from '@/types/entities';
import styles from './GroupForm.module.css';
import Card from '@/lib/components/Card';
import GroupListItem from '@/app/components/GroupListItem';
import Label from '@/lib/components/Label';
import Input, { Textarea } from '@/lib/components/Input';
import TagInput from '@/lib/components/TagInput';
import Button from '@/lib/components/Button';
import ImageInput from '@/lib/components/ImageInput';
import { createGroupAction, updateGroupAction } from '../actions';
import Form from '@/lib/components/Form';

const cx = classNames.bind(styles);

const GroupPreview = ({ values }: { values: GroupCreate | GroupUpdate }) => {
  return (
    <GroupListItem
      withMeta={false}
      group={{
        id: 0,
        name: values.name ?? '',
        description: values.description ?? '',
        photoUrl: values.photoUrl ?? '',
        goalRep: values.goalRep ?? 0,
        discordWebhookUrl: values.discordWebhookUrl ?? '',
        discordInviteUrl: values.discordInviteUrl ?? '',
        owner: {
          nickname: values.ownerNickname ?? '',
          id: 0,
          createdAt: 0,
          updatedAt: 0,
        },
        likeCount: 0,
        tags: values.tags ?? [],
        participants: [],
        badges: [],
        recordCount: 0,
        createdAt: 0,
        updatedAt: 0,
      }}
    />
  );
};

const GroupForm = ({
  type,
  group,
  onSubmit,
}: {
  type: 'create' | 'update';
  group?: Group;
  onSubmit: (groupId: number) => void;
}) => {
  const defaultValues: GroupUpdate | undefined = group
    ? {
        ..._.omit(group, [
          'id',
          'owner',
          'likeCount',
          'badges',
          'createdAt',
          'updatedAt',
          'participants',
          'recordCount',
        ]),
        ownerNickname: group.owner.nickname,
        ownerPassword: '',
      }
    : undefined;

  const { register, handleSubmit, setValue, watch, formState, setError } =
    useForm<GroupCreate | GroupUpdate>({
      defaultValues,
    });

  const values = watch();

  const submit = async (data: GroupCreate | GroupUpdate) => {
    const action =
      type === 'update' && group
        ? (values: GroupUpdate) => updateGroupAction(group.id, values)
        : createGroupAction;
    const result = await action(data as GroupCreate);
    if (result.status !== 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result.error.path as any) ?? 'root', {
        message: result.error.message,
      });
      return;
    }

    onSubmit(result.data.id);
  };

  return (
    <div className={cx('container')}>
      <Card className={cx('card')}>
        <h1 className={cx('title')}>
          {type === 'create' ? '그룹 만들기' : '그룹 수정하기'}
        </h1>
        <Form
          className={cx('form')}
          onSubmit={handleSubmit(submit)}
          error={formState.errors.root?.message}
        >
          <div className={cx('formItem')}>
            <Label id="name" htmlFor="name" error={!!formState.errors.name}>
              그룹명
            </Label>
            <Input
              type="text"
              placeholder="100KM 달성 챌린지"
              {...register('name', {
                required: '그룹명을 입력해 주세요.',
              })}
              error={formState.errors.name?.message}
            />
          </div>
          <div className={cx('thumbnail')}>
            <Label id="photoUrl" htmlFor="photoUrl">
              썸네일
            </Label>
            <ImageInput
              className={cx('thumbnailInput')}
              values={values.photoUrl ? [values.photoUrl] : []}
              onChange={(values: string[]) => {
                setValue('photoUrl', values[0]);
              }}
            />
          </div>
          <div>
            <Label
              id="description"
              htmlFor="description"
              error={!!formState.errors.description}
            >
              설명
            </Label>
            <Textarea
              className={cx('description')}
              placeholder="다 같이 열심히 해서 러닝으로 100KM를 찍어봐요."
              {...register('description', {
                required: '설명을 입력해 주세요.',
              })}
              error={formState.errors.description?.message}
            />
          </div>

          <div>
            <Label
              id="discordWebhookUrl"
              htmlFor="discordWebhookUrl"
              error={!!formState.errors.discordWebhookUrl}
            >
              디스코드 웹훅 URL
            </Label>
            <Input
              type="text"
              placeholder="URL을 입력해 주세요."
              {...register('discordWebhookUrl', {
                required: '디스코드 웹훅 URL을 입력해 주세요.',
              })}
              error={formState.errors.discordWebhookUrl?.message}
            />
          </div>
          <div>
            <Label
              id="discordInviteUrl"
              htmlFor="discordInviteUrl"
              error={!!formState.errors.discordInviteUrl}
            >
              디스코드 서버 초대 URL
            </Label>
            <Input
              type="text"
              placeholder="URL을 입력해 주세요."
              {...register('discordInviteUrl', {
                required: '디스코드 서버 초대 URL을 입력해 주세요.',
              })}
              error={formState.errors.discordInviteUrl?.message}
            />
          </div>
          <div>
            <Label
              id="ownerNickname"
              htmlFor="ownerNickname"
              error={!!formState.errors.ownerNickname}
            >
              닉네임
            </Label>
            <Input
              type="text"
              placeholder="닉네임을 입력해 주세요."
              disabled={type === 'update'}
              {...register('ownerNickname', {
                required: '닉네임을 입력해 주세요.',
              })}
              error={formState.errors.ownerNickname?.message}
            />
          </div>
          <div>
            <Label
              id="ownerPassword"
              htmlFor="ownerPassword"
              error={!!formState.errors.ownerPassword}
            >
              비밀번호
            </Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              {...register('ownerPassword', {
                required: '비밀번호를 입력해 주세요.',
              })}
              error={formState.errors.ownerPassword?.message}
            />
          </div>
          <div className={cx('tags')}>
            <Label id="tags" htmlFor="tags">
              태그
            </Label>
            <TagInput
              value={values.tags ?? []}
              onChange={(tags) => {
                setValue('tags', tags);
              }}
              maxTags={5}
            />
          </div>
          <div className={cx('goalRep')}>
            <Label
              id="goalRep"
              htmlFor="goalRep"
              error={!!formState.errors.goalRep}
            >
              목표 횟수
            </Label>
            <Input
              type="number"
              placeholder="목표 횟수를 입력해 주세요."
              {...register('goalRep', {
                valueAsNumber: true,
                required: '목표 횟수를 입력해 주세요.',
              })}
              error={formState.errors.goalRep?.message}
            />
          </div>
          <div>
            <Button
              className={cx('submitButton')}
              type="submit"
              disabled={!formState.isValid}
            >
              {type === 'create' ? '만들기' : '수정하기'}
            </Button>
          </div>
        </Form>
      </Card>
      <div className={cx('preview')}>
        <div className={cx('previewTitle')}>미리보기</div>
        <GroupPreview values={values} />
      </div>
    </div>
  );
};

export default GroupForm;
