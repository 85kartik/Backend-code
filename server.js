const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", userRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});