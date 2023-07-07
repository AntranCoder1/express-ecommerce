import express from "express";
import * as ctrl from "../controllers/collaboratorOrder.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";
const router = express.Router();

router.post(
  "/",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getAllOrderByCollaborator
);
export default router;
