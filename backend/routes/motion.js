import express from "express";
import { getMotion, sendMotion } from "../controllers/motion.js";

const router = express.Router();

router.get("/getMotion", getMotion);
router.post("/sendMotion", sendMotion);


export default router;
