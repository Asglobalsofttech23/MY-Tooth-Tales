import express from "express";
import db from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/register", async (req : any, res : any) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const [existingUser]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req : any, res: any) => {
  const { username, password } = req.body;

  try {
    const [users]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, users[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
