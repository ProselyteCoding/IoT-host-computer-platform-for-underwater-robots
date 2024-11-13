import { db } from "../db.js";

// 获取 data 表中的所有信息
export const getData = (req, res) => {
  const q = "SELECT * FROM data";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};