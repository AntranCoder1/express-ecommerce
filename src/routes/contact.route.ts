import express from "express";
const router = express.Router();
import * as ctrl from "../controllers/contact.controller";
router.post("/", ctrl.sendContact);
export default router;
