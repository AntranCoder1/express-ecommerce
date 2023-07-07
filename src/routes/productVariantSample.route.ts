import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/productVariantSample.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
router.get(
  "/getListByCompany",
  jwtMiddleware,
  companyMiddleware,
  ctrl.getListByCompany
);
router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.update);
router.delete("/delete/:id", jwtMiddleware, companyMiddleware, ctrl.deleteById);
export default router;
