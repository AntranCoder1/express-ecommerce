import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import * as ctrl from "../controllers/productTechnicalSample.controller";

const router = express.Router();

router.post("/create", jwtMiddleware, companyMiddleware, ctrl.create);
router.post("/update", jwtMiddleware, companyMiddleware, ctrl.update);
router.get("/getList", jwtMiddleware, companyMiddleware, ctrl.getList);
router.delete("/delete", jwtMiddleware, companyMiddleware, ctrl.deleteById);
export default router;
