const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.priority) {
      const valid = ['Low', 'Medium', 'High'];
      if (!valid.includes(req.query.priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
      }
      filter.priority = req.query.priority;
    }
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    const valid = ['Low', 'Medium', 'High'];
    if (!valid.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }
    const task = new Task({ title: title.trim(), priority });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.completed) return res.status(400).json({ error: 'Task already completed' });
    task.completed = true;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
