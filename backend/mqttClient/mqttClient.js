import { db } from "../db.js";
import mqtt from "mqtt";

// MQTT 服务器设置
const broker = 'mqtt://172.6.0.240';  // MQTT 代理地址
const topicSensor = 'sensor/data';  
const topicControl = 'control/movement';

// 传感器值
let temperature = 0.0;  
let pressure = 0.0;  
let depth = 0.0;  

// 创建 MQTT 客户端
const client = mqtt.connect(broker);

// 处理连接事件
client.on('connect', () => {
    console.log('MQTT client connected');
    subscribeControlSignals(); // 连接成功后订阅控制信号
    publishSensorData(); // 连接成功后开始发布数据
});

client.on('error', (err) => {
    console.error('Error connecting to MQTT broker:', err);
});

// 处理接收到的消息的函数
client.on('message', (topic, message) => {
    console.log(`Received message: ${message.toString()} on topic ${topic}`);

    const msg = JSON.parse(message.toString());
    
    // 根据发送方和主题将消息写入数据库
    if (topic === topicControl) {
        const sqlStatus = 'INSERT INTO status (motion, time, state) VALUES (?, NOW(), ?)';
        
        db.query(sqlStatus, [msg.motion, 'active'], (err) => { 
            if (err) {
                console.error('Error inserting status into database:', err);
            } else {
                console.log('Motion command status inserted into database.');
            }
        });
    } else if (topic === topicSensor) {
        const sqlData = 'INSERT INTO data (temperature, pressure, depth, time) VALUES (?, ?, ?, NOW())';
        
        db.query(sqlData, [msg.temperature, msg.pressure, msg.depth], (err) => {
            if (err) {
                console.error('Error inserting sensor data into database:', err);
            } else {
                console.log('Sensor data inserted into database.');
            }
        });
    }
});

// 用于发布传感器数据的函数
function publishSensorData() {
    setInterval(() => {
        // 模拟传感器数据
        temperature = (Math.random() * (30 - 15) + 15).toFixed(2); // 温度范围 15-30℃
        pressure = (Math.random() * (105 - 95) + 95).toFixed(2); // 气压范围 95-105 KPa
        depth = (Math.random() * (10 - 0) + 0).toFixed(2); // 深度范围 0-10 M

        // 发布传感器数据，包含发送者信息和数据
        const payload = JSON.stringify({
            sender: 'sensor_device', // 假定发送器的标识
            temperature,
            pressure,
            depth
        });

        client.publish(topicSensor, payload, (err) => {
            if (err) {
                console.error('Error publishing sensor data:', err);
            } else {
                console.log(`Published: ${payload}`);
            }
        });
    }, 1000); // 每秒发布一次
}

// 订阅控制信号的函数
function subscribeControlSignals() {
    client.subscribe(topicControl, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topicControl}`);
        } else {
            console.error('Subscription error:', err);
        }
    });
}

// 启动控制信号订阅
subscribeControlSignals();

// 导出相关功能
export {
    publishSensorData,
    subscribeControlSignals,
    client
};
