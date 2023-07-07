import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/brand.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({ storage: tempMulterDiskStorage("brand-icon") });

router.get("", jwtMiddleware, ctrl.getAll);
router.get("/getByCat/:id", jwtMiddleware, ctrl.getByCat);
router.get("/getOne/:id", jwtMiddleware, ctrl.getOne);
router.get("/get/:slug", ctrl.getBySlug);
router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.updateBrand);
router.delete(
  "/delete/:id",
  jwtMiddleware,
  companyMiddleware,
  ctrl.deleteBrand
);
router.post("/uploadIcon", upload.single("image"), ctrl.uploadIcon);
router.get("/image/:name", ctrl.getImage);
export default router;
