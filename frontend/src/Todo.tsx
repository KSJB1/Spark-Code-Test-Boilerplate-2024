// import React from 'react';
// import './App.css';

// export type TodoType = {
//   title: string,
//   description: string,
// }

// function Todo({ title, description }: TodoType) {
//   return (
//     <div className="todo">
//       <div className="todo-details">
//         <p className="todo-title">{title}</p>
//         <p className="todo-description">{description}</p>
//       </div>
//     </div>
//   );
// }

// export default Todo;

// src/AddTodo.js
// src/AddTodo.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Todo } from "./types";

interface AddTodoProps {
  onAdd: (newTodo: Todo) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [task, setTask] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!task.trim()) {
      return; // Do not add empty tasks
    }

    const newTodo: Todo = { task };

    try {
      const response = await fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const addedTodo = await response.json();
      onAdd(addedTodo);
      setTask("");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={task}
        onChange={handleChange}
        placeholder='Add a new task'
        required
      />
      <button type='submit'>Add Todo</button>
    </form>
  );
};

export default AddTodo;
