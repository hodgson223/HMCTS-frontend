import { useState } from "react";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = { title, description, status, dueDate };

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setConfirmation(data);
  };

  return (
    <div>
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description (optional):</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <label>Due Date/Time:</label>
        <input
          type="datetime-local"
          value={dueDate}
          required
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">Create Task</button>
      </form>

      {confirmation && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid green" }}>
          <h3>{confirmation.message}</h3>
          <p><strong>Title:</strong> {confirmation.task.title}</p>
          <p><strong>Description:</strong> {confirmation.task.description}</p>
          <p><strong>Status:</strong> {confirmation.task.status}</p>
          <p><strong>Due:</strong> {confirmation.task.dueDate}</p>
        </div>
      )}
    </div>
  );
}

export default TaskForm;
