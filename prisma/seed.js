import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 이미지 파일명 반환 (DB에는 uploads/파일명만 저장)
const getImageUrl = (filename) => {
  return `uploads/${filename}`;
};

async function main() {
  console.log('>>> SEED DATA GENERATION START');
  console.log('='.repeat(60));

  // 기존 데이터 삭제 + 시퀀스 리셋 (개발 환경에서만!)
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "records" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "participants" RESTART IDENTITY CASCADE');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "groups" RESTART IDENTITY CASCADE');

  console.log('[OK] Database cleanup completed (ID reset to 1)');
  console.log('');

  // ============================================================
  // >>> GROUP 1: Morning Running Team
  // ============================================================

  // 1. owner 없이 그룹 먼저 생성
  const group1 = await prisma.group.create({
    data: {
      name: '[테스트] 새벽 러닝 팀',
      description: '매일 아침 6시에 모여서 함께 달려요! 초보자 환영',
      photoUrl: getImageUrl('sample-group-1.jpg'),
      goalRep: 100,
      tags: ['달리기', '새벽', '건강'],
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 45,
      badges: ['PARTICIPANT_10'],
      ownerId: null, // 나중에 설정
    },
  });

  // 2. 참여자들 생성
  const participants1 = await prisma.participant.createMany({
    data: [
      { nickname: '[샘플] 러닝고수', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 초보러너', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 마라톤왕', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 달리기조아', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 건강맨', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 조깅러버', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 아침형인간', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 런런런', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 페이스메이커', password: '1234', groupId: group1.id },
      { nickname: '[샘플] 스피드러너', password: '1234', groupId: group1.id },
    ],
  });

  // 3. owner 설정
  const owner1 = await prisma.participant.findFirst({
    where: { groupId: group1.id, nickname: '[샘플] 러닝고수' },
  });
  await prisma.group.update({
    where: { id: group1.id },
    data: { ownerId: owner1.id },
  });

  // 그룹 1 운동 기록들
  const allParticipants1 = await prisma.participant.findMany({
    where: { groupId: group1.id },
  });

  for (let i = 0; i < 25; i++) {
    const author = allParticipants1[i % allParticipants1.length];
    await prisma.record.create({
      data: {
        exerciseType: 'run',
        description: `[더미] ${i + 1}일차 러닝 완료! 오늘도 열심히 달렸습니다`,
        time: Math.floor(Math.random() * 3600) + 1800, // 30분~90분
        distance: Math.round((Math.random() * 5 + 3) * 100) / 100, // 3~8km
        photos: [getImageUrl('sample-record-run-1.jpg'), getImageUrl('sample-record-run-2.jpg')],
        groupId: group1.id,
        authorId: author.id,
      },
    });
  }

  console.log('[OK] Group 1 created (10 participants, 25 records)');

  // ============================================================
  // >>> GROUP 2: Weekend Cycling Club
  // ============================================================
  const group2 = await prisma.group.create({
    data: {
      name: '[테스트] 주말 자전거 동호회',
      description: '매주 토요일 한강에서 라이딩해요',
      photoUrl: getImageUrl('sample-group-2.jpg'),
      goalRep: 50,
      tags: ['자전거', '주말', '한강'],
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 28,
      badges: [],
      ownerId: null,
    },
  });

  const participants2 = await prisma.participant.createMany({
    data: [
      { nickname: '[샘플] 바이크마스터', password: '1234', groupId: group2.id },
      { nickname: '[샘플] 페달밟는사람', password: '1234', groupId: group2.id },
      { nickname: '[샘플] 사이클리스트', password: '1234', groupId: group2.id },
      { nickname: '[샘플] 라이더', password: '1234', groupId: group2.id },
      { nickname: '[샘플] 자전거조아', password: '1234', groupId: group2.id },
    ],
  });

  const owner2 = await prisma.participant.findFirst({
    where: { groupId: group2.id, nickname: '[샘플] 바이크마스터' },
  });
  await prisma.group.update({
    where: { id: group2.id },
    data: { ownerId: owner2.id },
  });

  const allParticipants2 = await prisma.participant.findMany({
    where: { groupId: group2.id },
  });

  for (let i = 0; i < 15; i++) {
    const author = allParticipants2[i % allParticipants2.length];
    await prisma.record.create({
      data: {
        exerciseType: 'bike',
        description: `[더미] ${i + 1}주차 라이딩 완료! 날씨 좋았어요`,
        time: Math.floor(Math.random() * 5400) + 3600, // 60분~150분
        distance: Math.round((Math.random() * 20 + 15) * 100) / 100, // 15~35km
        photos: [getImageUrl('sample-record-bike-1.jpg')],
        groupId: group2.id,
        authorId: author.id,
      },
    });
  }

  console.log('[OK] Group 2 created (5 participants, 15 records)');

  // ============================================================
  // >>> GROUP 3: Swimming Beginners
  // ============================================================
  const group3 = await prisma.group.create({
    data: {
      name: '[테스트] 수영 왕초보',
      description: '천천히 배우는 수영 모임',
      photoUrl: getImageUrl('sample-group-3.jpg'),
      goalRep: 30,
      tags: ['수영', '초보', '실내'],
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 12,
      badges: [],
      ownerId: null,
    },
  });

  const participants3 = await prisma.participant.createMany({
    data: [
      { nickname: '[샘플] 수영선생', password: '1234', groupId: group3.id },
      { nickname: '[샘플] 물속고기', password: '1234', groupId: group3.id },
      { nickname: '[샘플] 헤엄치는사람', password: '1234', groupId: group3.id },
    ],
  });

  const owner3 = await prisma.participant.findFirst({
    where: { groupId: group3.id, nickname: '[샘플] 수영선생' },
  });
  await prisma.group.update({
    where: { id: group3.id },
    data: { ownerId: owner3.id },
  });

  const allParticipants3 = await prisma.participant.findMany({
    where: { groupId: group3.id },
  });

  for (let i = 0; i < 8; i++) {
    const author = allParticipants3[i % allParticipants3.length];
    await prisma.record.create({
      data: {
        exerciseType: 'swim',
        description: `[더미] ${i + 1}회차 수영 연습! 조금씩 늘어요`,
        time: Math.floor(Math.random() * 1800) + 1200, // 20분~50분
        distance: Math.round((Math.random() * 1 + 0.5) * 100) / 100, // 0.5~1.5km
        photos: [getImageUrl('sample-record-swim-1.jpg')],
        groupId: group3.id,
        authorId: author.id,
      },
    });
  }

  console.log('[OK] Group 3 created (3 participants, 8 records)');

  // ============================================================
  // >>> GROUP 4: Solo But Consistent
  // ============================================================
  const group4 = await prisma.group.create({
    data: {
      name: '[테스트] 혼자서도 꾸준히',
      description: '운동 기록 공유하며 동기부여 받아요',
      photoUrl: getImageUrl('sample-group-4.jpg'),
      goalRep: 200,
      tags: ['혼자', '꾸준함', '동기부여'],
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 156,
      badges: ['LIKE_100', 'RECORD_100'],
      ownerId: null,
    },
  });

  const participants4 = await prisma.participant.createMany({
    data: [
      { nickname: '[샘플] 혼자운동', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 자기관리왕', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 루틴지키미', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 꾸준왕', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 오늘도운동', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 건강체력', password: '1234', groupId: group4.id },
      { nickname: '[샘플] 매일매일', password: '1234', groupId: group4.id },
    ],
  });

  const owner4 = await prisma.participant.findFirst({
    where: { groupId: group4.id, nickname: '[샘플] 혼자운동' },
  });
  await prisma.group.update({
    where: { id: group4.id },
    data: { ownerId: owner4.id },
  });

  const allParticipants4 = await prisma.participant.findMany({
    where: { groupId: group4.id },
  });

  // 다양한 운동 타입으로 많은 기록 생성
  const exerciseTypes = ['run', 'bike', 'swim'];
  for (let i = 0; i < 110; i++) {
    const author = allParticipants4[i % allParticipants4.length];
    const exerciseType = exerciseTypes[i % exerciseTypes.length];

    await prisma.record.create({
      data: {
        exerciseType,
        description: `[더미] ${i + 1}일차 ${
          exerciseType === 'run' ? '달리기' : exerciseType === 'bike' ? '자전거' : '수영'
        } 완료!`,
        time: Math.floor(Math.random() * 3600) + 1200,
        distance: Math.round((Math.random() * 10 + 2) * 100) / 100,
        photos: [],
        groupId: group4.id,
        authorId: author.id,
      },
    });
  }

  console.log('[OK] Group 4 created (7 participants, 110 records)');

  // ============================================================
  // >>> GROUP 5: Empty Group (Test Purpose)
  // ============================================================
  const group5 = await prisma.group.create({
    data: {
      name: '[테스트] 신규 그룹',
      description: '방금 만들어진 그룹입니다',
      photoUrl: null,
      goalRep: 50,
      tags: [],
      discordWebhookUrl: null,
      discordInviteUrl: null,
      likeCount: 0,
      badges: [],
      ownerId: null, // owner 없는 그룹 (테스트용)
    },
  });

  console.log('[OK] Group 5 created (empty group)');
  console.log('');
  console.log('='.repeat(60));
  console.log('>>> SEED DATA GENERATION COMPLETE');
  console.log('--- Summary:');
  console.log('    5 groups created');
  console.log('    25 participants created');
  console.log('    158 exercise records created');
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('='.repeat(60));
    console.error('>>> SEED DATA GENERATION FAILED');
    console.error('--- Error:', e.message);
    console.error('='.repeat(60));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
