import jwtMiddleware from "../middlewares/jwt.middleware";
import marketerMiddleware from "../middlewares/marketer.middleware";
import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/domainProduct.controller";
router.get("/getListByCategory", ctrl.getListByCategory);
router.get("/getListBySubCategory", ctrl.getListBySubCategory);
router.get("/getListByDomain/:id", ctrl.getListByDomain);
router.post("/getBySlug", ctrl.getBySlug);
router.post("/getBySlugs", jwtMiddleware, marketerMiddleware, ctrl.getBySlugs);

router.post("/getRecommendSlug", ctrl.getRecommendSlug);
router.post("/create", jwtMiddleware, ctrl.create);
router.post("/update", ctrl.update);
router.post("/delete/:id", ctrl.deleteById);
router.post("/deleteList", ctrl.deleteList);
// router.get('/getInterval/:id', ctrl.getInterval);
router.post("/search", ctrl.search);
router.get("/", ctrl.getAllProduct);

export default router;
