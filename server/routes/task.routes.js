const express = require("express");
const protect = require("../middleware/auth.middleware");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleTask
} = require("../controllers/task.controller");

const router = express.Router();

router.use(protect);

// Create task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Complete / Pending task
router.patch("/:id/toggle", toggleTask);

module.exports = router;
