import { RankDuration } from '@/types/entities';
import GroupDetail from '../components/GroupDetail';
import GroupTab from '../components/GroupTab';
import RankList from './components/RankList';
import RankTabHeader from './components/RankTabHeader';
import { getGroupAction } from '../../actions';
import { getRanksAction } from './actions';

const GroupRankPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: number }>;
  searchParams: Promise<{ duration: RankDuration }>;
}) => {
  const groupId = Number((await params).groupId);
  const duration = (await searchParams).duration ?? RankDuration.MONTHLY;
  const group = await getGroupAction(groupId);
  const ranks = await getRanksAction(groupId, duration);

  return (
    <>
      <GroupDetail group={group} />
      <GroupTab groupId={groupId} selectedTab="rank">
        <RankTabHeader
          groupId={groupId}
          participantCount={group.participants.length}
          duration={duration}
        />
      </GroupTab>
      <RankList ranks={ranks} />
    </>
  );
};

export default GroupRankPage;
