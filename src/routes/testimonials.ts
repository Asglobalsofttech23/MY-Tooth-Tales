import express from "express";
import db from "../config/db";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err : any, user: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

router.get("/", authenticateToken, async (req: any, res: any) => {
  try {
    const [testimonials] = await db.query("SELECT * FROM testimonials");
    res.json({ testimonials });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticateToken, async (req: any, res: any) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ message: "Name and text are required" });
  }

  try {
    await db.query("INSERT INTO testimonials (name, text) VALUES (?, ?)", [name, text]);
    res.status(201).json({ message: "Testimonial added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authenticateToken, async (req: any, res: any) => {
  const { id } = req.params;
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ message: "Name and text are required" });
  }

  try {
    await db.query("UPDATE testimonials SET name = ?, text = ? WHERE id = ?", [name, text, id]);
    res.json({ message: "Testimonial updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateToken, async (req: any, res: any) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM testimonials WHERE id = ?", [id]);
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
