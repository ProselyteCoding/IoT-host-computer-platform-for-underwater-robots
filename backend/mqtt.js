import { db } from "./db.js";
import mqtt from "mqtt";

// MQTT 服务器设置
const broker = 'mqtt://172.6.0.240';
const port = 1883;
const topicSensor = 'sensor/data';  
const topicControl = 'control/movement';

// 创建 MQTT 客户端
const client = mqtt.connect(broker);

// 处理连接事件
client.on('connect', () => {
    console.log('MQTT client connected');
    // 订阅控制信号和传感器数据主题
    client.subscribe([topicControl, topicSensor], (err) => {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log(`Subscribed to topics: ${topicControl} and ${topicSensor}`);
        }
    });
});

// 错误处理
client.on('error', (err) => {
    console.error('Error connecting to MQTT broker:', err);
});

// 处理接收到的消息的函数
client.on('message', (topic, message) => {
    console.log(`Received message: ${message.toString()} on topic ${topic}`);

    try {
        const msg = JSON.parse(message.toString());

        if (topic === topicSensor) {
            const { temperature, pressure, depth } = msg;
            const sql = 'INSERT INTO data (temperature, pressure, depth, time) VALUES (?, ?, ?, NOW())';
            
            db.query(sql, [temperature, pressure, depth], (err, result) => {
                if (err) {
                    console.error('Error inserting sensor data into database:', err);
                } else {
                    console.log('Sensor data inserted into database.');
                }
            });
        } else if (topic === topicControl) {
            const motionCommand = msg.motion;
            const sqlStatus = 'INSERT INTO status (motion, time, state) VALUES (?, NOW(), ?)';

            db.query(sqlStatus, [motionCommand, 'active'], (err) => {
                if (err) {
                    console.error('Error inserting status into database:', err);
                } else {
                    console.log('Status inserted into database.');
                }
            });
        }
    } catch (error) {
        console.error('Failed to parse JSON message:', error);
    }
});

// 导出 MQTT 客户端以供其他模块使用
export { client };
