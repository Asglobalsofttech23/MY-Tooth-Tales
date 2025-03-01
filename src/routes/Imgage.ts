import express from "express";
const router = express.Router();
import multer from "multer";
import db from "../config/db";


// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// API to get image by ID (1 or 2)
router.get("/images/:id", async (req:any, res:any) => {
  const id = parseInt(req.params.id);
  if (![1, 2 , 3].includes(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [rows]: any = await db.query("SELECT image FROM homepage_images WHERE id = ?", [id]);

    if (rows.length > 0 && rows[0].image) {
      res.setHeader("Content-Type", "image/jpeg");
      res.send(rows[0].image);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// API to update image (only for ID 1 or 2)
router.post("/images/:id", upload.single("image"), async (req:any, res:any) => {
  const id = parseInt(req.params.id);
  if (![1, 2 , 3].includes(id)) return res.status(400).json({ error: "Invalid ID" });

  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  try {
    // Delete old image (not needed as MySQL updates the row)
    await db.query("UPDATE homepage_images SET image = ? WHERE id = ?", [req.file.buffer, id]);

    res.json({ success: true, message: "Image updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database update failed" });
  }
});
export default router;