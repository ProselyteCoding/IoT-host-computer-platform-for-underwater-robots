import express from "express";
import { getData, updateData } from "../controllers/data.js";

const router = express.Router();

router.get("/get", getData);
router.post("/update", updateData);

export default router;
