import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/marketerTransaction.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

router.post("/marketer", jwtMiddleware, marketerMiddleware, ctrl.getByMarketer);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getAll);

export default router;
