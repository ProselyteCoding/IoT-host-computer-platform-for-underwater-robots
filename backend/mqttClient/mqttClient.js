import {db, initializeDatabase} from "../db.js";
import mqtt from "mqtt";

// MQTT服务器设置  
const broker = 'mqtt://172.6.0.240';  // MQTT代理地址  
const topicSensor = 'sensor/data';  
const topicControl = 'control/movement';  

// 传感器值  
let temperature = 0.0;  
let pressure = 0.0;  
let depth = 0.0;  

// 创建MQTT客户端  
const client = mqtt.connect(broker);  

// 用于发布传感器数据的函数  
function publishSensorData() {  
    setInterval(() => {  
        // 模拟传感器数据  
        temperature = (Math.random() * (30 - 15) + 15).toFixed(2); // 温度范围 15-30℃  
        pressure = (Math.random() * (105 - 95) + 95).toFixed(2); // 气压范围 95-105 KPa  
        depth = (Math.random() * (10 - 0) + 0).toFixed(2); // 深度范围 0-10 M  

        // 发布传感器数据  
        const payload = `Temperature: ${temperature} °C, Pressure: ${pressure} kPa, Depth: ${depth} m`;  
        client.publish(topicSensor, payload);  
        console.log(`Published: ${payload}`);  
    }, 1000); // 每秒发布一次  
}  

// 处理接收到的消息的函数  
client.on('message', (topic, message) => {  
    // 打印接收到的消息  
    console.log(`Received message: ${message.toString()} on topic ${topic}`);  

    // 将消息写入数据库  
    const msg = message.toString();  
    const sql = 'INSERT INTO data (message) VALUES (?)'; // 确保有一个名为data的表  

    // 确保数据库连接已经初始化和成功  
    if (db) {  
        db.query(sql, [msg], (err, result) => {  
            if (err) {  
                console.error('Error inserting data into database:', err);  
            } else {  
                console.log('Data inserted into database, ID:', result.insertId);  
            }  
        });  
    } else {  
        console.error('Database connection is not initialized');  
    }  
});  

// 订阅控制信号的函数  
function subscribeControlSignals() {  
    client.on('connect', () => {  
        client.subscribe(topicControl, (err) => {  
            if (!err) {  
                console.log(`Subscribed to topic: ${topicControl}`);  
            } else {  
                console.error('Subscription error:', err);  
            }  
        });  
    });  
}  

// 启动传感器数据发布  
publishSensorData();  

// 启动控制信号订阅  
subscribeControlSignals();