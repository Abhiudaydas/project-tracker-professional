import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import axios from "axios";

export default function ProjectBoard({
  project,
  onTasksChange,
  onProjectUpdate,
}) {
  const [tasks, setTasks] = useState(project.tasks);

  useEffect(() => {
    setTasks(project.tasks);
  }, [project]);

  // Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, removed);
    setTasks(newTasks);
    onTasksChange(project._id, newTasks);
  };

  // Add New Task
  const addCustomTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: "New Task",
      isDone: false,
      note: "",
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange(project._id, updatedTasks);
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
    try {
      await axios.put(`http://localhost:5000/api/projects/${project._id}`, {
        tasks: newTasks,
      });
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{project.name}</h2>
      </div>
      <button
        onClick={addCustomTask}
        className="mt-4 bg-gray-300 px-4 py-1 rounded"
      >
        + Add Custom Task
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
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
    </div>
  );
}
