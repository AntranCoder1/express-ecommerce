import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/domain.controller";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
const bannerMulter = multer({
  storage: tempMulterDiskStorage("domain-banner"),
});
const logoMulter = multer({ storage: tempMulterDiskStorage("domain-logo") });
const faviconMulter = multer({
  storage: tempMulterDiskStorage("domain-favicon"),
});

//#region Gets
router.get("/getById/:id", ctrl.getById);
router.get("/getListByMarketer", jwtMiddleware, ctrl.getListByMarketer);
router.get("/getByAddress/:address", ctrl.getByAddress);
router.get("/switch/:id", jwtMiddleware, ctrl.switchDomain);
router.get("/getDomain", jwtMiddleware, ctrl.getDomainChoosen);
//#endregion
//#region Modifies
router.post("/create", jwtMiddleware, ctrl.create);
router.post("/update", ctrl.updateBasicInfo);
router.post("/updateStatus", ctrl.updateStatus);
router.post("/updateWebsiteAddress", ctrl.updateWebsiteAddress);
//#endregion
//#region Delete
router.delete(
  "/delete/:id",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.deleteById
);
//#endregion
//#region Banner, Logo & favicon
router.post(
  "/updateBanner",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.updateBanner
);

router.post("/updateLogo", jwtMiddleware, marketerMiddleware, ctrl.updateLogo);
router.post("/updateUrl", jwtMiddleware, marketerMiddleware, ctrl.updateUrl);

router.post(
  "/updateHeader",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.updateHeader
);
router.post(
  "/uploadBanner",
  jwtMiddleware,
  marketerMiddleware,
  bannerMulter.single("file"),
  ctrl.uploadBanner
);

router.post(
  "/uploadOneBanner",
  jwtMiddleware,
  marketerMiddleware,
  bannerMulter.single("file"),
  ctrl.uploadOneBanner
);
router.post("/uploadLogo", logoMulter.single("file"), ctrl.uploadLogo);
router.post("/uploadFavicon", faviconMulter.single("file"), ctrl.uploadFavicon);
router.get("/banner/:name", ctrl.getBanner);
router.get("/logo/:name", ctrl.getLogo);
router.get("/event/:name", ctrl.getEventBanner);
router.get("/favicon/:name", ctrl.getFavicon);
router.post(
  "/updateSocial",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.updateSocial
);

router.get(
  "/getAllDomain",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.getAllDomainByMarketer
);

router.post("/addLink", jwtMiddleware, marketerMiddleware, ctrl.addLinkDomain);

router.post(
  "/removeLink",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.removeLinkDomain
);
//#endregion
router.get("/", ctrl.getAllDomain);
export default router;
