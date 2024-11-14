import express from "express";
import { sendOperation, getOperations, getHistory } from "../controllers/motion.js"; // 导入控制器逻辑

const router = express.Router();

// 发送运动指令并记录操作
router.post("/sendMotion", sendOperation);

// 读取操作日志
router.get("/getOperations", getOperations); 

// 读取状态日志
router.get("/getHistory", getHistory);

export default router;
