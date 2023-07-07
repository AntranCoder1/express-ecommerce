import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/orderRefund.controller";
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
export default router;
