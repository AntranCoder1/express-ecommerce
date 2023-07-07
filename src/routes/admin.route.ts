import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/admin.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
router.post("/login", ctrl.login);
router.get("/", jwtMiddleware, adminMiddleware, ctrl.getOne);
export default router;
