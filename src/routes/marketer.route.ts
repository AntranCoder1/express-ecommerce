import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/marketer.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
const upload = multer({ storage: tempMulterDiskStorage("marketer-avatar") });
router.get("/getById", jwtMiddleware, ctrl.getById);
router.get("/getListByCompany/:id", ctrl.getListByCompany);
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/changePassword", ctrl.changePassword);
router.post("/update", ctrl.update);
router.post("/uploadAvatar", upload.single("file"), ctrl.uploadAvatar);
router.get("/avatar/:name", ctrl.getAvatar);
router.delete("/delete/:id", ctrl.deleteById);
router.post("/loadReview", ctrl.reviewProduct);

export default router;
