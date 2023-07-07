import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/blogCategory.controller";
router.get("/list/:id", ctrl.getList);
router.get("/getById/:id", ctrl.getById);
router.post("/create", ctrl.create);
router.post("/update", ctrl.updateById);
router.delete("/delete/:id", ctrl.deleteById);
export default router;
