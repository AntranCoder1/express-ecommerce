import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorWithdrawHistory.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({
  storage: tempMulterDiskStorage("collaborator-withdraw-history"),
});

router.post(
  "/collaborator",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getByCollaborator
);

router.post(
  "/create",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.createRequestByCollaborator
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
