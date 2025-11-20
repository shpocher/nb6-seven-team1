import prisma from '../utils/prisma.js';

export async function updateGroupBadges(groupId) {
  try {
    const [participantCount, recordCount, group] = await Promise.all([
      //필요한 값( 참여자 수, 운동기록 수, 그룹) 가져오기
      prisma.participant.count({ where: { groupId: Number(groupId) } }),
      prisma.record.count({ where: { groupId: Number(groupId) } }),
      prisma.group.findUnique({
        where: { id: Number(groupId) },
        select: { id: true, badges: true, likeCount: true },
      }),
    ]);

    //그룹이 없으면 그냥 빠져나감
    if (!group) return null;

    //뱃지 만들기
    const badgesSet = new Set(group.badges || []);

    //뱃지 조건 확인 - 추가, 제거
    participantCount >= 10 ? badgesSet.add('PARTICIPANT_10') : badgesSet.delete('PARTICIPANT_10');
    recordCount >= 100 ? badgesSet.add('RECORD_100') : badgesSet.delete('RECORD_100');
    group.likeCount >= 100 ? badgesSet.add('LIKE_100') : badgesSet.delete('LIKE_100');

    //조건에 따라서 만든 뱃지, Set를 스프래드연산자로 배열 전환
    const newBadges = [...badgesSet];
    //기존에 가지고 있던 뱃지, 없을 시 빈 배열
    const oldBadges = group.badges || [];

    //정렬 후 둘을 비교해서 같다면 업데이트를 하지 않고 기존 뱃지 배열을 가지고감
    //길이가 같고, 새로운 뱃지와 기존 뱃지의 내용이 같은지 비교
    if (newBadges.length === oldBadges.length && newBadges.every((b) => oldBadges.includes(b))) {
      return { updated: false, badges: oldBadges };
    }

    //뱃지 업데이트
    const updated = await prisma.group.update({
      where: { id: group.id },
      data: { badges: newBadges },
    });

    //return 추가
    return { updated: true, badges: updated.badges };
  } catch (err) {
    debugError('배지 업데이트 실패:', err);
  }
}
