const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/task.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "https://inib-seven.vercel.app"
]);

const isAllowedOrigin = (origin) => {
    if (!origin || allowedOrigins.has(origin)) {
        return true;
    }

    try {
        const url = new URL(origin);
        return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
    } catch (error) {
        return false;
    }
};

const corsOptions = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 204
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
