import express from "express";
import * as ctrl from "../controllers/product.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";

const upload = multer({
  storage: tempMulterDiskStorage("company-product-image"),
});

const router = express.Router();

router.post("/getBySlug", jwtMiddleware, companyMiddleware, ctrl.getBySlug);
router.get("/getById/:id", jwtMiddleware, companyMiddleware, ctrl.getById);
router.get("/getListByCategory/:id", jwtMiddleware, ctrl.getListByCategory);
router.get(
  "/getListBySubCategory/:id",
  jwtMiddleware,
  ctrl.getListBySubCategory
);
router.get("/getListByCompany", jwtMiddleware, ctrl.getListByCompany);
router.post("/getRecommendSlug", jwtMiddleware, ctrl.getRecommendSlug);
router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
router.post("/deleteMany", ctrl.deleteMany);
router.post("/uploadImages", upload.array("file", 10), ctrl.uploadImages);
router.get("/image/:name", ctrl.getImage);
router.post("/deleteImages", ctrl.deleteImages);
router.post("/search", jwtMiddleware, ctrl.searchProduct);
router.post(
  "/uPosition",
  jwtMiddleware,
  companyMiddleware,
  ctrl.updatePositionImage
);
router.post("/findReviewProductId", jwtMiddleware, ctrl.getReviewProduct);
export default router;
