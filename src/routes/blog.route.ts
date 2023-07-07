import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/blog.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
const upload = multer({
  storage: tempMulterDiskStorage("domain-blog-thumbnail"),
});
router.get("/list/:id", ctrl.getList);
router.post("/create", ctrl.create);
router.post("/update", ctrl.updateById);
router.delete("/delete/:id", ctrl.deleteById);
router.post("/uploadThumbnail", upload.single("file"), ctrl.uploadThumbnail);
router.get("/thumbnail/:name", ctrl.getThumbnail);
export default router;
