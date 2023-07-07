import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/receiver.controller";
router.get("/getList/:id", ctrl.getList);
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
export default router;
