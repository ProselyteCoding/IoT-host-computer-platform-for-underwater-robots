import { db } from "../db.js"; 
import { client } from "../mqtt.js"; // 使用已有的 MQTT 客户端

// 处理方向指令并发送到 MQTT
export const sendOperation = (req, res) => {
    const { motion } = req.body; // 从请求中获取运动指令

    // 将指令写入 operation 表
    const sqlOperation = 'INSERT INTO operation (motion, time) VALUES (?, NOW())';

    db.query(sqlOperation, [motion], (err, result) => {
        if (err) {
            return res.status(500).json(err); 
        } else {
            // 发送指令到 MQTT
            client.publish("control/movement", motion, (mqttErr) => {
                if (mqttErr) {
                    return res.status(500).json({ message: "Error sending to MQTT", error: mqttErr });
                } else {
                    return res.status(200).json("Motion command recorded and sent to MQTT.");
                }
            });
        }
    });
};

// 获取操作记录
export const getOperations = (req, res) => {
    const q = "SELECT * FROM operation";

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data); // 返回操作记录
    });
};

// 写入
