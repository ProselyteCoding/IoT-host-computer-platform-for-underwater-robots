import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
let isInitialized = false; // 用于跟踪数据库是否已经初始化

// 数据库连接
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// 创建和删除表的函数
export const initializeDatabase = () => {
  if (isInitialized) return; // 如果已经初始化，直接返回

  // 连接到数据库
  db.connect((err) => {
    if (err) {
      console.error("连接失败: " + err.stack);
      return;
    }
    console.log("已连接到数据库,ID: " + db.threadId);

    const dropDataTable = `DROP TABLE IF EXISTS data`;
    const dropOperationTable = `DROP TABLE IF EXISTS operation`;
    const dropStatusTable = `DROP TABLE IF EXISTS status`;

    // 删除data表（如果存在）
    db.query(dropDataTable, (err) => {
      if (err) {
        console.error("删除data表失败: " + err.message);
        db.end(); // 关闭连接
        return;
      }
      console.log("data表已删除(如果存在)");

      // 创建data表
      // 需要修改
      const createDataTable = `  
          CREATE TABLE data (  
            id INT AUTO_INCREMENT PRIMARY KEY,  
            temperature FLOAT NOT NULL,  
            pressure FLOAT NOT NULL,  
            depth FLOAT NOT NULL,
            time TIMESTAMP NOT NULL
          )  
      `;

      db.query(createDataTable, (err) => {
        if (err) {
          console.error("创建data表失败: " + err.message);
          db.end(); // 关闭连接
          return;
        }
        console.log("data表创建成功");
      });
    });

    // 删除operation表（如果存在）
    db.query(dropOperationTable, (err) => {
      if (err) {
        console.error("删除operation表失败: " + err.message);
        db.end(); // 关闭连接
        return;
      }
      console.log("operation表已删除(如果存在)");

      // 创建operation表
      // 需要修改
      const createOperationTable = `  
          CREATE TABLE operation (  
            id INT AUTO_INCREMENT PRIMARY KEY,  
            motion VARCHAR(25) NOT NULL,
            time TIMESTAMP NOT NULL
          )  
      `;

      db.query(createOperationTable, (err) => {
        if (err) {
          console.error("创建operation表失败: " + err.message);
          db.end(); // 关闭连接
          return;
        }
        console.log("operation表创建成功");
      });
    });

    // 删除status表（如果存在）
    db.query(dropStatusTable, (err) => {
      if (err) {
        console.error("删除status表失败: " + err.message);
        db.end(); // 关闭连接
        return;
      }
      console.log("status表已删除(如果存在)");

      // 创建status表
      //需要修改
      const createStatusTable = `  
          CREATE TABLE status (  
            id INT AUTO_INCREMENT PRIMARY KEY,  
            motion VARCHAR(25) NOT NULL,
            time TIMESTAMP NOT NULL,
            state VARCHAR(25) NOT NULL
          )  
      `;

      db.query(createStatusTable, (err) => {
        if (err) {
          console.error("创建status表失败: " + err.message);
          db.end(); // 关闭连接
          return;
        }
        console.log("status表创建成功");
      });
    });

    // 创建表完成后，设置 isInitialized 为 true
    isInitialized = true;
  });
};
