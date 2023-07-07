import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorDomain.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";

router.post(
  "/add",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.addCollaboratorDomain
);
router.post(
  "/remove",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.addCollaboratorDomain
);
export default router;
