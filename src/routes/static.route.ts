import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/static.controller";
router.get("/image/:name", ctrl.getImage);
export default router;
