import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { Task } from "./types";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios
      .get<{ tasks: Task[] }>("http://localhost:3001/rest/tasks")
      .then((response) =>
        setTasks(response.data.tasks.filter((task) => task.status !== 2))
      )
      .catch((error) => console.error("Error fetching tasks!", error));
  }, []);

  const addTask = (task: string) => {
    axios
      .post<{ task: Task }>("http://localhost:3001/rest/tasks", { title: task })
      .then((response) => setTasks([...tasks, response.data.task]))
      .catch((error) => console.error("Error adding task!", error));
  };

  const completeTask = (id: string) => {
    axios
      .put(`http://localhost:3001/rest/tasks/${id}/status`, { status: "DONE" })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error completing task!", error);
      });
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Todo List</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route
            path="/tasks"
            element={
              <>
                <TaskForm addTask={addTask} />
                <TaskList tasks={tasks} completeTask={completeTask} />
              </>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
