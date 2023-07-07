import express from "express";
import * as ctrl from "../controllers/productConfigToken.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";

const router = express.Router();
router.post("/create", ctrl.createProductToken);
router.get("/getList", ctrl.getList);

export default router;
