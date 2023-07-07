import express from "express";
import * as ctrl from "../controllers/event.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
const bannerMulter = multer({ storage: tempMulterDiskStorage("banner-event") });

const router = express.Router();
router.post(
  "/uploadBanner",
  jwtMiddleware,
  marketerMiddleware,
  bannerMulter.single("file"),
  ctrl.uploadBanner
);
router.post("/create", jwtMiddleware, marketerMiddleware, ctrl.createEvent);
router.post("/", jwtMiddleware, marketerMiddleware, ctrl.getEvent);
router.get("/", ctrl.getImageEvent);
export default router;
