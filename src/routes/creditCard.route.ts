import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/creditCard.controller";
router.post("/getByUser", ctrl.getByUser);
router.post("/create", ctrl.create);
router.post("/update", ctrl.update);
router.delete("/delete/:id", ctrl.deleteById);
export default router;
