import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const handleAddTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = {
      id: Date.now(),
      name: taskInput,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    setTaskInput("");
  };

  const toggleTimer = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (task.isRunning) {
            const updatedElapsed = task.elapsedTime + (Date.now() - task.startTime);
            return { ...task, isRunning: false, elapsedTime: updatedElapsed, startTime: null };
          } else {
            return { ...task, isRunning: true, startTime: Date.now() };
          }
        }
        return task;
      })
    );

    setActiveTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Update running timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.isRunning) {
            return { ...task };
          }
          return task;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || "User"}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter a new task"
            className="flex-grow px-4 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet. Add one!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded border border-gray-200 shadow"
              >
                <div>
                  <p className="text-lg font-medium">{task.name}</p>
                  <p className="text-sm text-gray-500">
                    Time Tracked:{" "}
                    {formatTime(
                      task.isRunning
                        ? task.elapsedTime + (Date.now() - task.startTime)
                        : task.elapsedTime
                    )}
                  </p>
                </div>
                <button
                  onClick={() => toggleTimer(task.id)}
                  className={`px-4 py-2 text-white rounded shadow ${
                    task.isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {task.isRunning ? "Stop" : "Start"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
