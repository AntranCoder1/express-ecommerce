import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/customerFavourite.controller";
router.get("/list/:id", ctrl.list);
router.post("/update", ctrl.update);
router.post("/isLiked", ctrl.isLiked);
export default router;
