const Task = require("../models/task.model");

const ensureTaskOwnership = async (req, taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        return { task: null, error: "NOT_FOUND" };
    }

    if (task.user.toString() !== req.user._id.toString()) {
        return { task: null, error: "FORBIDDEN" };
    }

    return { task };
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            user: req.user._id,
            title: title.trim(),
            description,
            priority,
            dueDate: dueDate || null
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message
        });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const ownershipCheck = await ensureTaskOwnership(req, id);

        if (ownershipCheck.error === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (ownershipCheck.error === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this task"
            });
        }

        const task = await Task.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: error.message
        });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const ownershipCheck = await ensureTaskOwnership(req, id);

        if (ownershipCheck.error === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (ownershipCheck.error === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this task"
            });
        }

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
            error: error.message
        });
    }
};

// Toggle task between completed and pending
const toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const ownershipCheck = await ensureTaskOwnership(req, id);

        if (ownershipCheck.error === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (ownershipCheck.error === "FORBIDDEN") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this task"
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date() : null;

        await task.save();

        res.status(200).json({
            success: true,
            message: task.completed
                ? "Task completed successfully"
                : "Task marked as pending",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task status",
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleTask
};
