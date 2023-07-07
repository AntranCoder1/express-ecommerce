import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import * as ctrl from "../controllers/productSubCategory.controller";

const router = express.Router();

router.post("/getBySlug", jwtMiddleware, companyMiddleware, ctrl.getBySlug);
router.post("/getRecommendSlug", ctrl.getRecommendSlug);
router.get("/getListByCompany/:id", ctrl.getListByCompany);
router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
router.post("/deleteAndHandleProducts", ctrl.deleteAndHandleProducts);
router.get("/getListByCategory/:id", ctrl.getListByCategory);
export default router;
