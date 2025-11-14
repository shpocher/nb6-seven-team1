import { NotFoundError } from '../middlewares/error-handler.js';
import { debugError } from './debug.js';

export async function sendChangeRecordMsg(group, record, next) {
  try {
    //기본 seed data에는  webhookURL이 null 처리 되어있음
    //기본 seed가지고 테스트 하려면 아래 코드 활성화 및 아래 코드 비활성화

    // const discordURL =
    //   'https://discord.com/api/webhooks/1435533418145255516/2nIZI1jChcPZHGuAMbZOZ2DK4lJ5EwyF1-YHZMD7hM62yAai0L39obMkae_y8fj425uD';

    //테스트 하려면 이 사이의 코드 비활성화
    const discordURL = group.discordWebhookUrl;

    if (!group.discordWebhookUrl) {
      throw new NotFoundError('Discord webhook용 URL이 존재하지 않습니다.');
    }
    //테스트 하려면 이 사이의 코드 비활성화

    debugError('그룹 URL확인됨', discordURL);

    const embeds = [
      {
        title: `[${record.author.nickname}]님의 운동 기록`,
        fields: [
          { name: '운동 시간 : ', value: record.time },
          { name: '운동 타입 : ', value: record.exerciseType },
        ],
      },
    ];

    const response = await fetch(discordURL, {
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
    next(err);
  }
}
