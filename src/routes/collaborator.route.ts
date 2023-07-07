import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaborator.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/getById", jwtMiddleware, collaboratorMiddleware, ctrl.getById);
router.get(
  "/getAlldomain",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getAllDomain
);
export default router;
