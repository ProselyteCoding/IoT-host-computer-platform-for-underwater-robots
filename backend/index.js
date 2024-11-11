import express from "express";
import dataRoutes from "./routes/data.js";
import motionRoutes from "./routes/motion.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeDatabase } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

// 初始化数据库
initializeDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/data",dataRoutes);
app.use("/api/motion",motionRoutes);
app.use()

//监听后端服务器端口
app.listen(process.env.PORT, () => {
  console.log(`Connected to backend on http://localhost:${process.env.PORT}`);
});
