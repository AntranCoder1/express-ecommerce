import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/area.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
router.get("/getCities", ctrl.getCities);
router.get("/getDistricts/:id", ctrl.getDistricts);
router.get("/getCommunes/:id", ctrl.getCommunes);

router.get("/seedCity", jwtMiddleware, companyMiddleware, ctrl.seedCity);
router.get(
  "/seedDistrict",
  jwtMiddleware,
  companyMiddleware,
  ctrl.seedDistrict
);
router.get("/seedCommune", jwtMiddleware, companyMiddleware, ctrl.seedCommune);
export default router;
