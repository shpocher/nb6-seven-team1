import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import {
  EXERCISE_TYPE_MAP,
  ExerciseType,
  RecordCreate,
} from '@/types/entities';
import styles from './RecordForm.module.css';
import Dropdown from '@/lib/components/Dropdown';
import Form from '@/lib/components/Form';
import Input, { Textarea } from '@/lib/components/Input';
import Label from '@/lib/components/Label';
import Button from '@/lib/components/Button';
import formatTime from '@/lib/formatTime';
import Card from '@/lib/components/Card';
import ImageInput from '@/lib/components/ImageInput';
import { createRecordAction } from '../actions';


const cx = classNames.bind(styles);

const defaultValues: RecordCreate = {
  exerciseType: ExerciseType.RUN,
  photos: [],
  description: '',
  distance: 1,
  time: 0,
  authorNickname: '',
  authorPassword: '',
};

const RecordForm = ({
  groupId,
  time,
  onSubmit,
}: {
  groupId: number;
  time: number;
  onSubmit: () => void;
}) => {
  const { register, setValue, watch, handleSubmit, setError, formState } =
    useForm<RecordCreate>({
      defaultValues: {
        ...defaultValues,
        time,
      },
    });

  const submit = async (data: RecordCreate) => {
    const reuslt = await createRecordAction(groupId, data);
    if (reuslt.status !== 200) {
      setError('root', {
        message: reuslt.error.message,
      });
      return;
    }
    onSubmit();
  };

  return (
    <Card className={cx('container')}>
      <h1 className={cx('heading')}>기록 생성하기</h1>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <div>
          <Label htmlFor="exerciseType">운동 종류</Label>
          <Dropdown
            options={Object.values(ExerciseType).map((type) => ({
              label: EXERCISE_TYPE_MAP[type],
              value: type,
            }))}
            value={watch('exerciseType')}
            onChange={(value: string) => {
              setValue('exerciseType', value as ExerciseType);
            }}
          />
        </div>

        <div className={cx('photos')}>
          <Label htmlFor="photos">사진</Label>
          <ImageInput
            className={cx('photosInput')}
            maxCount={3}
            values={watch('photos')}
            onChange={(urls) => {
              setValue('photos', urls);
            }}
          />
        </div>

        <div>
          <Label htmlFor="description" error={!!formState.errors.description}>
            설명
          </Label>
          <Textarea
            id="description"
            error={formState.errors.description?.message}
            {...register('description', {
              required: '설명을 입력해 주세요.',
            })}
          />
        </div>

        <div>
          <Label htmlFor="distance">거리</Label>
          <Input
            type="number"
            id="distance"
            error={formState.errors.distance?.message}
            {...register('distance', {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Label>시간</Label>
          <Input type="text" value={formatTime(time)} disabled />
          <input
            type="hidden"
            value={time}
            {...register('time', {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Label htmlFor="authorNickname">닉네임</Label>
          <Input
            type="text"
            id="authorNickname"
            error={formState.errors.authorNickname?.message}
            {...register('authorNickname', {
              required: '닉네임을 입력해 주세요.',
            })}
          />
        </div>

        <div>
          <Label htmlFor="authorPassword">비밀번호</Label>
          <Input
            id="authorPassword"
            type="password"
            error={formState.errors.authorPassword?.message}
            {...register('authorPassword', {
              required: '비밀번호를 입력해 주세요.',
            })}
          />
        </div>

        <Button type="submit" className={cx('submit')} disabled={!formState.isValid}>
          생성하기
        </Button>
      </Form>
    </Card>
  );
};

export default RecordForm;
