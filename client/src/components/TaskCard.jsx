// src/components/TaskCard.jsx
export default function TaskCard({ task, onStart, onStop }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl mb-4">
      <h2 className="text-lg font-semibold">{task.title}</h2>
      <p className="text-gray-500">{task.description}</p>
      <p className="text-sm text-gray-400">Tracked: {task.timeTracked} min</p>
      {task.isRunning ? (
        <button
          onClick={() => onStop(task._id)}
          className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={() => onStart(task._id)}
          className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
        >
          Start
        </button>
      )}
    </div>
  );
}
