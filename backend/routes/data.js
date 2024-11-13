import express from "express";
import { getData} from "../controllers/data.js";

const router = express.Router();

router.get("/get", getData);

export default router;
