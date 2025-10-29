import express from "express";
import cors from "cors";
import path from "path";
import { sequelize } from "./config/database";
import productRoutes from "./routes/product.route";

const app = express();

// enable cors for all origins
app.use(cors());

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// basic route to check if server is running
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to CRUD API Server",
    version: "1.0.0",
    endpoints: {
      products: {
        create: "POST /api/products",
        list: "GET /api/products",
        get: "GET /api/products/:id",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id"
      }
    }
  });
});

// mount product routes
app.use("/api", productRoutes);

// serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// catch 404 and return json error
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export async function startServer() {
  try {
    // test the connection
    await sequelize.authenticate();
    console.log("Database connection established successfully ✅");
    
    // sync database models
    await sequelize.sync({ alter: true });
    console.log("Database synchronized ✅");
  } catch (err) {
    console.error("Database connection failed ❌", err);
    process.exit(1);
  }
}

export default app;