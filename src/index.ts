import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import testimonialRoutes from "./routes/testimonials";
import ApppasswordRoutes from "./routes/Apppassword";
import db from "./config/db";
import Imagage from "./routes/Imgage"


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/login", authRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/send-email", ApppasswordRoutes);
app.use("/images",Imagage);

//Testmonials get Method

app.get("/testmonial", async (req: any, res: any) => {
    try {
      const [testimonials] = await db.query("SELECT * FROM testimonials");
      res.json({ testimonials });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
