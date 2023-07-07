import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/customerWithdrawHistory.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({
  storage: tempMulterDiskStorage("customer-withdraw-history"),
});

router.post(
  "/updateProcessing",
  jwtMiddleware,
  adminMiddleware,
  ctrl.updateProcessing
);

router.post("/", jwtMiddleware, adminMiddleware, ctrl.getByAdmin);

router.get("/one/:id", jwtMiddleware, ctrl.getOne);

router.post(
  "/updateWithDraw",
  jwtMiddleware,
  adminMiddleware,
  upload.single("file"),
  ctrl.updateWithdraw
);

router.get("/image/:name", ctrl.getImage);

export default router;
