import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/collaboratorProduct.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import collaboratorMiddleware from "../middlewares/collaborator.middleware";

router.post(
  "/create",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.createCollaboratorProduct
);

router.post(
  "/getByDomain",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getProductByCollaboratorDomainId
);

router.get(
  "/getAll",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getAllProduct
);

router.get(
  "/getListByDomain/:id",
  jwtMiddleware,
  collaboratorMiddleware,
  ctrl.getListByDomain
);
export default router;
