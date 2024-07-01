import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDb } from "./config/db.js";
import categoryRoutes from "./routes/category.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";
import uploadRoutes from "./routes/upload.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();
const mongoURI = process.env.MONGO_URI;

app.use(express.json({ limit: "5mb" })); // to parse body data
app.use(express.urlencoded({ extended: true })); // to parse body data
app.use(cookieParser());

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

 

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));


app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
  connectDb(mongoURI);
});
