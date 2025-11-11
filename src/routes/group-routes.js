import express from "express";
import groupController from "../controllers/group-controller.js";

const groupRouter = express.Router();

groupRouter
  .get("/", groupController.getGroupList)
  .get("/:id", groupController.getGroupDetail)
  .post("/", groupController.createGroup)
  .delete("/:id", groupController.deleteGroup)
  .patch("/:id", groupController.patchGroup);

export default groupRouter;
