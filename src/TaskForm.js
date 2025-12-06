import { useState, useEffect } from "react";
import axios from "axios";

function TaskForm() {
  // Form state
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });

  // Confirmation state
  const [confirmation, setConfirmation] = useState(null);

  // Tasks loaded from backend
  const [tasksFromDB, setTasksFromDB] = useState([]);

  // Get tasks when component loads
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => {
        // Backend might return {tasks: []} or []
        setTasksFromDB(res.data.tasks || res.data);
      })
      .catch(() => {
        console.log("Error fetching tasks");
      });
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/tasks", task);

      setConfirmation(res.data);

      // Reset form
      setTask({
        title: "",
        description: "",
        status: "Pending",
        dueDate: "",
      });

      // Refresh task list
      const updated = await axios.get("http://localhost:5000/tasks");
      setTasksFromDB(updated.data.tasks || updated.data);

    } catch (err) {
      setConfirmation({
        message: err.response?.data?.error || "Network error",
      });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create New Task</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={task.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={task.description}
          onChange={handleChange}
        />

        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="datetime-local"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Task</button>
      </form>

      {/* Confirmation */}
      {confirmation && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid green",
          }}
        >
          <h3>{confirmation.message}</h3>
          {confirmation.task && (
            <div>
              <p>
                <strong>Title:</strong> {confirmation.task.title}
              </p>
              <p>
                <strong>Description:</strong> {confirmation.task.description}
              </p>
              <p>
                <strong>Status:</strong> {confirmation.task.status}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {new Date(confirmation.task.dueDate).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Display tasks from DB */}
      <h3 style={{ marginTop: "30px" }}>Existing Tasks</h3>
      <ul>
        {tasksFromDB.map((t) => (
          <li key={t._id} style={{ marginBottom: "15px" }}>
            <strong>{t.title}</strong> — {t.status}
            <br />
            Due: {new Date(t.dueDate).toLocaleString()}
            <br />
            {t.description}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskForm;
