import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Summary = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getTotalTime = () => {
    return tasks.reduce((total, task) => total + (task.elapsedTime || 0), 0);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log("Fetched tasks:", response.data);
        setTasks(response.data?.tasks || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchTasks();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Summary</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Total Time Tracked</h2>

        {loading ? (
          <p>Loading summary...</p>
        ) : (
          <>
            <p className="text-2xl text-blue-700 font-semibold mb-6">
              {formatTime(getTotalTime())}
            </p>

            <h3 className="text-lg font-bold mb-2">Task Summary</h3>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center">No task data available</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task._id || task.id}
                    className="bg-gray-50 border border-gray-200 px-4 py-3 rounded shadow"
                  >
                    <p className="font-medium text-lg">{task.name}</p>
                    <p className="text-sm text-gray-600">
                      Time Tracked: {formatTime(task.elapsedTime || 0)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;
