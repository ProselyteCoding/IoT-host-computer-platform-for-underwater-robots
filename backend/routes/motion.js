import express from "express";
import { sendOperation, getOperations } from "../controllers/motion.js"; // 导入控制器逻辑

const router = express.Router();

// 发送运动指令并记录操作
router.post("/sendMotion", sendOperation);

// 读取操作日志
router.get("/getOperations", getOperations); // 获取操作记录的接口

export default router;
