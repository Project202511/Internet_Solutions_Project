import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
// import TaskBoard from "./TaskBoard"; // optional

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  const statuses = ["TO DO", "IN PROGRESS", "DONE"];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;
    axios.post("http://localhost:5000/tasks", { name: newTaskName })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTaskName("");
      });
  };

  const updateTaskStatus = (id, status) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { status })
      .then(() => {
        setTasks(tasks.map((t) => (t._id === id ? { ...t, status } : t)));
      });
  };

  // 💡 Check if user is not logged in
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // ✅ Main App return starts here
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🗂️ Project Management</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="border px-3 py-2 w-full max-w-sm rounded"
          placeholder="Enter a new task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {statuses.map((status) => (
          <div key={status} className="bg-gray-50 rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">{status}</h2>
            {tasks.filter((task) => task.status === status).map((task) => (
              <div key={task._id} className="bg-white p-3 rounded mb-3 border shadow-sm">
                <div className="font-medium">{task.name}</div>
                <select
                  className="mt-2 border rounded px-2 py-1 text-sm"
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>sddsd
    </div>
  );
}

export default App;
