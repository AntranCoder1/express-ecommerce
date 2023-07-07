import express from "express";
import * as ctrl from "../controllers/product-link-domain.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
const router = express.Router();
router.get("/getAll", ctrl.getAll);
router.get("/", jwtMiddleware, marketerMiddleware, ctrl.getAllProduct);
router.post("/create", jwtMiddleware, marketerMiddleware, ctrl.create);
router.post("/update", jwtMiddleware, marketerMiddleware, ctrl.updateProduct);
router.get(
  "/domain/:id",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.getDomainInfo
);
export default router;
