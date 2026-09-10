const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/task.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "INIB To-Do API is running"
    });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
