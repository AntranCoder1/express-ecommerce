import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/devAnnounce.controller";
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
router.get("/getList", ctrl.getList);
export default router;
