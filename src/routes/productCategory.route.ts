import express from "express";

import * as ctrl from "../controllers/productCategory.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({
  storage: tempMulterDiskStorage("company-product-icon"),
});

const router = express.Router();
router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/getBySlug", jwtMiddleware, companyMiddleware, ctrl.getBySlug);
router.post(
  "/getRecommendSlug",
  jwtMiddleware,
  companyMiddleware,
  ctrl.getRecommendSlug
);
router.get("/getListByCompany", jwtMiddleware, ctrl.getListByCompany);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.update);
router.delete("/delete/:id", jwtMiddleware, companyMiddleware, ctrl.deleteById);
router.post(
  "/deleteAndHandleProducts",
  jwtMiddleware,
  companyMiddleware,
  ctrl.deleteAndHandleProducts
);
router.post(
  "/uploadIcon",
  jwtMiddleware,
  companyMiddleware,
  upload.single("image"),
  ctrl.uploadIcon
);
router.get("/image/:name", ctrl.getImage);
export default router;
