import express from "express";
import { getData} from "../controllers/data.js";

const router = express.Router();

//获取数据
router.get("/get", getData);

export default router;
