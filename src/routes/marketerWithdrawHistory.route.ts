import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/marketerWithdrawHistory.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
const upload = multer({
  storage: tempMulterDiskStorage("marketer-withdraw-history"),
});

router.post("/marketer", jwtMiddleware, marketerMiddleware, ctrl.getByMarketer);

router.post(
  "/create",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.createRequestByMarketer
);

router.post(
  "/updateProcessing",
  jwtMiddleware,
  adminMiddleware,
  ctrl.updateProcessing
);

router.post(
  "/updateWithDraw",
  jwtMiddleware,
  adminMiddleware,
  upload.single("file"),
  ctrl.updateWithdraw
);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getByAdmin);

router.get("/one/:id", jwtMiddleware, ctrl.getOne);

router.get("/image/:name", ctrl.getImage);
export default router;
