import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware";
import companyMiddleware from "../middlewares/company.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
const router = express.Router();
import * as ctrl from "../controllers/order.controller";
router.get(
  "/marketerGetOne/:id",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.getByIdMarketer
);
router.get(
  "/companyGetOne/:id",
  jwtMiddleware,
  companyMiddleware,
  ctrl.getByIdCompany
);
router.get("/getListByCompany", jwtMiddleware, ctrl.getListByCompany);
router.post("/getListByCustomer", jwtMiddleware, ctrl.getListByCustomer);
router.get("/getListByMarketer", jwtMiddleware, ctrl.getListByMarketer);
router.post("/create", jwtMiddleware, ctrl.create);
router.post("/createnl", ctrl.createnl);
router.post("/updateStatus", jwtMiddleware, ctrl.updateStatus);
router.delete("/delete/:id", jwtMiddleware, ctrl.deleteById);
router.get("/status", jwtMiddleware, ctrl.getStatus);
router.post(
  "/getByMarketer",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.getOrderByMarketer
);

router.post(
  "/getProduct",
  jwtMiddleware,
  marketerMiddleware,
  ctrl.getProductSoldByDomain
);

router.get(
  "/getProductByCompany",
  jwtMiddleware,
  companyMiddleware,
  ctrl.getProductSoldByCompany
);

router.get("/cancel/:id", jwtMiddleware, ctrl.getReasonCancel);

export default router;
