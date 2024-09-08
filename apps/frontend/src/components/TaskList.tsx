import React from "react";
import { List, ListItem, ListItemText, Radio, Divider } from "@mui/material";
import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  completeTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, completeTask }) => {
  if (!tasks.length) return <div>Taskはありません。</div>;

  return (
    <List>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <ListItem disableGutters>
            <Radio
              checked={task.status === 2}
              onChange={() => completeTask(task.id)}
            />
            <ListItemText primary={task.title} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskList;
