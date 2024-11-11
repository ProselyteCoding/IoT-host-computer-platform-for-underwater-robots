import { db } from "../db.js";

export const getMotion = async (req, res) => {
  try {
    const motion = await db.motion.find();
    res.status(200).json(motion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMotion = async (req, res) => {
  try {
    const motion = req.body;
    const newMotion = await db.motion.create(motion);
    res.status(201).json(newMotion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};