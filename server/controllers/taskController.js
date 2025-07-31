const Task = require("../models/taskModel");

// 📌 Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;
   
    const task = new Task({
      user: req.user.id, // ✅ Fix here
      title,
    });
    console.log("Creating task for user:", task);

    //console.log(task);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error in createTask:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    console.log("Inside getTasks");
    //console.log("User:", req.user);

    const tasks = await Task.find({ user: req.user.id });
    console.log(tasks);
    console.log("Fetching tasks for user:", req.user._id);

    console.log("Tasks found:", tasks.length);

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error in getTasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// 📌 Update task title or status
exports.updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    // 🔐 Only fetch task that belongs to logged-in user
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ error: "Task not found or unauthorized" });

    // ✅ Update only if values are provided
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed; // only if this field exists in schema

    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};


// 📌 Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
