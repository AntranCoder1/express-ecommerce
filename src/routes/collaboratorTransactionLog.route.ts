import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorTransactionLog.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post(
  "/collaborator",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getByCollaborator
);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getAll);

export default router;
