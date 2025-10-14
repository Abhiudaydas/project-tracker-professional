// src/components/ProjectBoard.jsx

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import axios from "axios";

export default function ProjectBoard({
  project,
  onTasksChange,
  onProjectUpdate,
  onResetProject, // This prop is for clearing the view after delete
}) {
  const [tasks, setTasks] = useState(project.tasks);

  // This effect ensures that when you switch projects, the tasks update correctly.
  useEffect(() => {
    setTasks(project.tasks);
  }, [project]);

  // Handler for drag-and-drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, removed);
    setTasks(newTasks);
    onTasksChange(project._id, newTasks);
  };

  // Handler for adding a new task
  const addCustomTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task - Edit Me!",
      isDone: false,
      note: "",
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange(project._id, updatedTasks);
  };

  // Handler for deleting a single task (passed to TaskItem)
  const handleDeleteTask = (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
    // Persist the change to the backend
    onTasksChange(project._id, newTasks);
  };

  // Handler for deleting the entire project
  const deleteProject = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${project._id}`);
        onResetProject(); // Clear the selected project view in App.js
        onProjectUpdate(); // Refetch the project list
      } catch (err) {
        console.error("Error deleting project", err);
        alert("Failed to delete the project.");
      }
    }
  };

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <button
          onClick={deleteProject}
          className="rounded border border-red-500 px-3 py-1 font-semibold text-red-600 hover:bg-red-500 hover:text-white"
        >
          🗑️ Delete Project
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* THIS IS THE CORRECTED PART */}
                      <TaskItem
                        task={task}
                        onChange={(updatedTask) => {
                          const updatedTasks = tasks.map((t) =>
                            t.id === task.id ? updatedTask : t
                          );
                          setTasks(updatedTasks);
                          onTasksChange(project._id, updatedTasks);
                        }}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={addCustomTask}
        className="mb-5 mt-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        + Add Custom Task
      </button>
    </div>
  );
}
