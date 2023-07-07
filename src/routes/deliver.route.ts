import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/deliver.controller";
router.get("/getList", ctrl.getList);
router.get("/seeding", ctrl.seeding);
router.post("/create", ctrl.create);
router.post("/update", ctrl.updateById);
router.delete("/delete/:id", ctrl.deleteById);
export default router;
