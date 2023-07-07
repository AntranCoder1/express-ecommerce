import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import * as ctrl from "../controllers/domainCategory.controller";
const upload = multer({
  storage: tempMulterDiskStorage("domain-product-icon"),
});
const router = express.Router();
router.get("/getListByDomain/:id", ctrl.getListByDomain);
router.post("/getListForMenu", ctrl.getListForMenu);
router.get("/getById/:id", ctrl.getById);
router.post("/getRecommendSlug", ctrl.getRecommendSlug);
router.post("/getBySlug", ctrl.getBySlug);
router.post("/create", ctrl.create);
router.post("/update", ctrl.updateByBody);
router.delete("/deleteById/:id", ctrl.deleteById);
router.post("/deleteByBody", ctrl.deleteByBody);
router.post(
  "/uploadIcon",
  jwtMiddleware,
  upload.single("image"),
  ctrl.uploadIcon
);
router.get("/image/:name", ctrl.getImage);
export default router;
