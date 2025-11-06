import prisma from "../utils/prisma.js";
import {
  UnauthorizedError,
  ConflictError,
} from "../middlewares/error-handler.js";

class ParticipantController {
  async createParticipant(req, res) {
    //구현
  }

  async deleteParticipant(req, res) {
    //구현
  }
}

export default new ParticipantController();
