import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/review.controller";
import jwtMiddleware from "../middlewares/jwt.middleware";
import maketerMiddleware from "../middlewares/marketer.middleware";

router.post("/createReviewCustomer", jwtMiddleware, ctrl.createReviewCustomer);

router.post("/findWithOrderId", jwtMiddleware, ctrl.findAllReviewWithOrderId);

router.post("/findWithDomainId", ctrl.findAllReviewWithDomainId);

router.post("/findWithProductDomainId", ctrl.findAllReviewWithDomainProductId);

router.post("/editReview", jwtMiddleware, ctrl.updateReview);

export default router;
