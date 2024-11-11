import { db } from "../db.js";

//登入成功时加载该用户的待办列表
export const getData = (req, res) => {
  const q = "SELECT * FROM underwater_robot";

  db.query(q, [req.query.uid], (err, data) => {
    if (err) return res.send(err);
    return res.status(200).json(data);
  });
};

//修改任意一个代办
export const updateData = (req, res) => {
  const q = `  
  UPDATE todos  
  SET selected = CASE   
                     WHEN selected = 0 THEN 1   
                     WHEN selected = 1 THEN 0   
                     ELSE selected   
                 END  
  WHERE id = ?;  
  `;
  const id = req.body.id.toString();
  db.query(q, [id], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Task has been deleted.");
  });
};
