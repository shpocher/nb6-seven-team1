import prisma from "../utils/prisma.js";

class HealthController {
  /**
   * 서버 상태 확인
   */
  async checkHealth(req, res) {
    res.status(200).json({
      message: "T1: Seven server  is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  }

  /**
   * 데이터베이스 연결 확인
   */
  async checkDatabase(req, res) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        message: "T1: Database connection is good!",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        message: "T1: Database connection failed",
        error: error.message,
      });
    }
  }
}

export default new HealthController();
