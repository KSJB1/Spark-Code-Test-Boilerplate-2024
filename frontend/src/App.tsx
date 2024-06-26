// import React, { useEffect, useState } from 'react';
// import './App.css';
// import Todo, { TodoType } from './Todo';

// function App() {
//   const [todos, setTodos] = useState<TodoType[]>([]);

//   // Initially fetch todo
//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const todos = await fetch('http://localhost:8080/');
//         if (todos.status !== 200) {
//           console.log('Error fetching data');
//           return;
//         }

//         setTodos(await todos.json());
//       } catch (e) {
//         console.log('Could not connect to server. Ensure it is running. ' + e);
//       }
//     }

//     fetchTodos()
//   }, []);

//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>TODO</h1>
//       </header>

//       <div className="todo-list">
//         {todos.map((todo) =>
//           <Todo
//             key={todo.title + todo.description}
//             title={todo.title}
//             description={todo.description}
//           />
//         )}
//       </div>

//       <h2>Add a Todo</h2>
//       <form>
//         <input placeholder="Title" name="title" autoFocus={true} />
//         <input placeholder="Description" name="description" />
//         <button>Add Todo</button>
//       </form>
//     </div>
//   );
// }

// export default App;
// src/App.js
// src/App.tsx
import React, { useState, useEffect } from "react";
import AddTodo from "./Todo";
import { Todo } from "./types";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/todos");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      console.error("Fetch error:", error);
      setTodos([]); // Set todos to an empty array on error
    }
  };

  const handleAddTodo = async (newTodo: Todo) => {
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

      // Update todos state correctly using functional update
      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <AddTodo onAdd={handleAddTodo} />
      <ul>
        {todos && todos.length > 0 ? (
          todos.map(todo => <li key={todo.id}>{todo.task}</li>)
        ) : (
          <li>No todos yet.</li>
        )}
      </ul>
    </div>
  );
};

export default App;
