import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function groupLikeCountUp(req, res) {
  const id = Number(req.params.id);
  const findGroup = await prisma.group.findUnique({
    where: { id },
  });

  if (!findGroup) return res.status(404).send({ message: "Group not found" });

  const likeCountUp = await prisma.group.update({
    where: { id },
    data: {
      likeCount: { increment: 1 },
    },
  });

  res.status(201).send(likeCountUp);
}

export async function groupLikeCountDown(req, res) {
  const id = Number(req.params.id);
  const findGroup = await prisma.group.findUnique({
    where: { id },
  });

  if (!findGroup) return res.status(404).send({ message: "Group not found" });

  const likeCountDown = await prisma.group.update({
    where: { id },
    data: {
      likeCount: { decrement: 1 },
    },
  });

  // 감소 요청 성공 코드에 뭘 써야할 지 몰라서 일단 200 작성
  res.status(200).send(likeCountDown);
}
