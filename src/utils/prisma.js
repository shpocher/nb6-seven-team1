import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.DEBUG_MODE === "true"
      ? ["query", "info", "warn", "error"] // ← 개발: 모든 로그 출력
      : ["error"], // ← 배포: 에러 로그만 출력
});

export default prisma;
