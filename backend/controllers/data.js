import { db } from "../db.js";

// 获取 data 表中的所有信息
export const getData = (req, res) => {
  const q = "SELECT * FROM data";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};

// 更新 data 表中的一条数据
export const updateData = (req, res) => {
  const { id, temperature, pressure, depth } = req.body;

  // 对于时间戳，使用NOW()来获取当前时间
  const q = `
    UPDATE data 
    SET temperature = ?, pressure = ?, depth = ?, time = NOW()
    WHERE id = ?`;

  db.query(q, [temperature, pressure, depth, id], (err) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Data has been updated.");
  });
};
