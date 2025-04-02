const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware.js");
const Task = require("../models/Task.js");

const router = express.Router();

// Create a new task
router.post("/", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
      status: "pending",
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Task creation failed" });
  }
});

// Get all tasks for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["username", "email", "profilePic"], // Fetch profilePic
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

// Update a task
router.put("/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    if (status === "completed") {
      task.completedAt = new Date();
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Error updating task" });
  }
});

// Mark a task as completed
router.patch("/:taskId/complete", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = "completed";
    task.completedAt = new Date();
    await task.save();
    res.json({ message: "Task marked as completed", task });
  } catch (err) {
    res.status(500).json({ error: "Error completing task" });
  }
});

// Delete a task
router.delete("/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
