const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  completed: {
  type: Boolean,
  default: false,
},
  totalTimeSpent: {
    type: Number, // in milliseconds
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
