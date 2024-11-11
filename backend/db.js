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
    const dropMotionTable = `DROP TABLE IF EXISTS motion`;

    // 删除 todos 表（如果存在）
    db.query(dropDataTable, (err) => {
      if (err) {
        console.error("删除data表失败: " + err.message);
        db.end(); // 关闭连接
        return;
      }
      console.log("data表已删除(如果存在)");

      // 删除 users 表（如果存在）
      db.query(dropMotionTable, (err) => {
        if (err) {
          console.error("删除motion表失败: " + err.message);
          db.end(); // 关闭连接
          return;
        }
        console.log("motion表已删除(如果存在)");

        // 创建 users 表
        //需要修改
        const createUsersTable = `  
          CREATE TABLE users (  
            id INT AUTO_INCREMENT PRIMARY KEY,  
            username VARCHAR(255) NOT NULL,  
            password VARCHAR(255) NOT NULL  
          )  
        `;

        db.query(createUsersTable, (err) => {
          if (err) {
            console.error("创建 users 表失败: " + err.message);
            db.end(); // 关闭连接
            return;
          }
          console.log("users 表创建成功");

          // 创建 todos 表，设置外键约束
          const createTodosTable = `  
            CREATE TABLE todos (  
              id VARCHAR(255) NOT NULL,  
              name VARCHAR(255) NOT NULL,  
              time VARCHAR(255) NOT NULL,  
              uid INT NOT NULL,  
              selected TINYINT,  
              overdue TINYINT,  
              PRIMARY KEY (id),  
              FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE  
            )  
          `;

          db.query(createTodosTable, (err) => {
            if (err) {
              console.error("创建 todos 表失败: " + err.message);
            } else {
              console.log("todos 表创建成功");
            }

            // 创建表完成后，设置 isInitialized 为 true
            isInitialized = true;
          });
        });
      });
    });
  });
};
