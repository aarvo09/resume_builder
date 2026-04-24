require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Step 3: Deploy a Basic Web Application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS) from the root working directory
// In a real cloud deployment, these might be served by Nginx or Apache
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(__dirname));

// =========================================================
// Step 4: Set Up Object Storage Placeholder
// Using multer as a placeholder for file upload handling (e.g., AWS S3, Google Cloud Storage)
// =========================================================
const upload = multer({ dest: "uploads/" }); // Typically configured with multer-s3 in production
app.post("/api/upload", upload.single("resume"), (req, res) => {
  // Logic to upload the file to your Cloud Storage Bucket goes here
  console.log("File received:", req.file);
  res.json({ message: "File successfully uploaded to object storage.", fileUrl: "https://your-storage-bucket-url.com/file" });
});

// =========================================================
// Step 5: Database as a Service (DBaaS) Placeholder
// E.g., Connecting to AWS RDS PostgreSQL or MySQL
// =========================================================
// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

app.get("/api/users", async (req, res) => {
  // Logic to fetch user information or application data from DBaaS
  // const result = await pool.query('SELECT * FROM users');
  // res.json(result.rows);
  res.json([{ id: 1, name: "Sample User", savedResumes: 2 }]);
});

app.post("/api/users", async (req, res) => {
  // Logic to store user information or application data into DBaaS
  const userData = req.body;
  console.log("Saving to DB:", userData);
  res.status(201).json({ message: "User data stored in Database successfully." });
});

// Health check endpoint (Useful for Step 6: Load Balancing Target Group Health Checks)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Fallback to index.html for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
