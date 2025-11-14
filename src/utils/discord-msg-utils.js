import { debugError } from './debug.js';

export async function sendChangeRecordMsg(record) {
  try {
    const discordURL =
      'https://discord.com/api/webhooks/1435533418145255516/2nIZI1jChcPZHGuAMbZOZ2DK4lJ5EwyF1-YHZMD7hM62yAai0L39obMkae_y8fj425uD';

    const embeds = [
      {
        title: `[${record.author.nickname}]님의 운동 기록`,
        fields: [
          { name: '운동 시간 : ', value: record.time },
          { name: '운동 타입 : ', value: record.exerciseType },
        ],
      },
    ];

    let response;
    response = await fetch(discordURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: '운동기록알림',
        embeds: embeds,
      }),
    });
  } catch (err) {
    debugError('webhook 처리에 실패했습니다.', err.message);
  }
}
