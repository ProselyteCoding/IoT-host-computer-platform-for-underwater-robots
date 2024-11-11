import express from "express";
import { recordOperation, getOperations } from "../controllers/motion.js"; // 导入控制器逻辑

const router = express.Router();

// 发送运动指令并记录操作
router.post("/sendMotion", recordOperation);

// 获取操作记录
router.get("/operations", getOperations); // 新增操作记录的接口

export default router;
