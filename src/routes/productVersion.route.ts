import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/productVersion.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({
  storage: tempMulterDiskStorage("company-product-version"),
});
router.get("/getById/:id", ctrl.getById);
router.get("/getListByProduct/:id", ctrl.getListByProduct);
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
router.post("/uploadImage", upload.single("file"), ctrl.uploadImage);
router.get("/image/:name", ctrl.getImage);
router.post("/deleteImages", ctrl.deleteImages);
router.post("/deleteMany", ctrl.deleteMany);
export default router;
