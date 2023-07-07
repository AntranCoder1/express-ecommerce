import express from "express";
import * as ctrl from "../controllers/permission.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
const router = express.Router();
router.get("/", jwtMiddleware, ctrl.checkPermission);
export default router;
