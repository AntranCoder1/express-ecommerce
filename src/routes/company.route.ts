import express from "express";
import * as ctrl from "../controllers/company.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
const logoMulter = multer({ storage: tempMulterDiskStorage("company-logo") });
const faviconMulter = multer({
  storage: tempMulterDiskStorage("company-favicon"),
});

const router = express.Router();

router.get("/getById", jwtMiddleware, companyMiddleware, ctrl.getById);
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post(
  "/changePassword",
  jwtMiddleware,
  companyMiddleware,
  ctrl.changePassword
);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.update);
router.delete("/delete/:id", jwtMiddleware, companyMiddleware, ctrl.deleteById);
router.post("/uploadLogo", logoMulter.single("file"), ctrl.uploadLogo);
router.get("/logo/:name", ctrl.getLogo);
router.post("/uploadFavicon", faviconMulter.single("file"), ctrl.uploadFavicon);
router.get("/favicon/:name", ctrl.getFavicon);
router.get(
  "/getListForMarketerRegistering",
  ctrl.getListForMarketerRegistering
);
export default router;
