import express from "express";
import passport from "passport";
const router = express.Router();
import * as ctrl from "../controllers/customer.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import multer from "multer";
import { tempMulterDiskStorage } from "../utils/upload.util";
import jwt from "../middlewares/jwt.middleware";
const upload = multer({ storage: tempMulterDiskStorage("customer-avatar") });
router.get("/getById", jwtMiddleware, ctrl.getById);
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/update", ctrl.update);
router.post("/changePassword", ctrl.changePassword);
router.post("/uploadAvatar", upload.single("file"), ctrl.uploadAvatar);
router.get("/avatar/:name", ctrl.getAvatar);
router.delete("/delete/:id", ctrl.deleteById);

router.post("/newAddress", jwtMiddleware, ctrl.createAddress);
router.get("/setDefault/:id", jwtMiddleware, ctrl.setDefaultAddress);
router.post("/updateAddress", jwtMiddleware, ctrl.updateAddress);
router.delete("/removeAddress/:id", jwtMiddleware, ctrl.removeAddress);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/customer/",
    failureRedirect: "/customer/fail",
  })
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/", (req, res) => {
  console.log();

  res.send("Success");
});

router.post("/depositToken", jwtMiddleware, ctrl.createCustomerToken);

router.get("/findHistoryToken", jwtMiddleware, ctrl.findHistoryToken);

router.post("/createWithdrawToken", jwtMiddleware, ctrl.createWithdrawToken);

router.post("/createWithdrawMoney", jwtMiddleware, ctrl.createWithdrawMoney);

router.post("/findReviewByMaketer", jwtMiddleware, ctrl.getReviewByMaketer);

export default router;
