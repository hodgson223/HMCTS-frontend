// src/TaskForm.js
import { useState } from "react";

function TaskForm() {
  // State to store form input
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });

  // State to store confirmation response
  const [confirmation, setConfirmation] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (res.ok) {
        setConfirmation(data); // display success
        // Reset form
        setTask({ title: "", description: "", status: "Pending", dueDate: "" });
      } else {
        setConfirmation({ message: data.error });
      }
    } catch (err) {
      setConfirmation({ message: "Network error" });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

        <select name="status" value={task.status} onChange={handleChange} required>
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

      {confirmation && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid green" }}>
          <h3>{confirmation.message}</h3>
          {confirmation.task && (
            <div>
              <p><strong>Title:</strong> {confirmation.task.title}</p>
              <p><strong>Description:</strong> {confirmation.task.description}</p>
              <p><strong>Status:</strong> {confirmation.task.status}</p>
              <p><strong>Due:</strong> {new Date(confirmation.task.dueDate).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskForm;
