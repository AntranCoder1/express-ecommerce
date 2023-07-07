import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/dev.controller";
router.get("/createSecretKey", ctrl.createSecretKey);
router.get("/sendMail", ctrl.sendMail);
export default router;
