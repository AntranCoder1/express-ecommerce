import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/bank.controller";
router.get("/getList", ctrl.getList);
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
router.get("/seed", ctrl.seed);
export default router;
