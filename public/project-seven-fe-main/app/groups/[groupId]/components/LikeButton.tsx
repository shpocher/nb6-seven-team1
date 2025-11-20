import { cookies } from 'next/headers';
import Image from 'next/image';
import classNames from 'classnames/bind';
import thumbsUpImage from '@/public/assets/thumbs-up-w.svg';
import thumbsUpImageFilled from '@/public/assets/thumbs-up-w-filled.svg';
import Button from '@/lib/components/Button';
import { likeGroupAction, unlikeGroupAction } from '../../actions';
import styles from './LikeButton.module.css';

const LIKED_GROUPS_COOKIE_NAME = 'likedGroups';

const cx = classNames.bind(styles);

const LikeButton = async ({
  className,
  groupId,
  likeCount,
}: {
  className?: string;
  groupId: number;
  likeCount: number;
}) => {
  const cookieStore = await cookies();
  const likedGroups = cookieStore.get(LIKED_GROUPS_COOKIE_NAME)?.value;
  const likedGroupsArray = likedGroups?.split(',') ?? [];
  const isLiked = likedGroupsArray.includes(groupId.toString());

  const handleLikeClick = async () => {
    'use server';
    const cookieStore = await cookies();
    const likedGroups = cookieStore.get(LIKED_GROUPS_COOKIE_NAME)?.value;
    const likedGroupsArray = likedGroups?.split(',') ?? [];
    const isLiked = likedGroupsArray.includes(groupId.toString());

    let nextLikedGroups = likedGroupsArray;
    if (isLiked) {
      await unlikeGroupAction(groupId);
      nextLikedGroups = nextLikedGroups.filter(
        (id) => id !== groupId.toString()
      );
    } else {
      await likeGroupAction(groupId);
      nextLikedGroups = [...nextLikedGroups, groupId.toString()];
    }

    cookieStore.set(LIKED_GROUPS_COOKIE_NAME, nextLikedGroups.join(','));
  };

  return (
    <Button
      type="button"
      className={cx('likeButton', className)}
      onClick={handleLikeClick}
    >
      <Image
        src={isLiked ? thumbsUpImageFilled : thumbsUpImage}
        alt="like"
        width={16}
        height={16}
      />{' '}
      {likeCount}
    </Button>
  );
};

export default LikeButton;
