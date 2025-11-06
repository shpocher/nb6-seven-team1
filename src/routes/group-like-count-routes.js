import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  groupLikeCountUp,
  groupLikeCountDown,
} from "../controllers/group-like-count-controller.js";

const groupLikeCount = express.Router();
const groupLikeCountRoute = groupLikeCount.route("/:id/likes");

groupLikeCountRoute.post(groupLikeCountUp);

groupLikeCountRoute.delete(groupLikeCountDown);

export { groupLikeCount };
