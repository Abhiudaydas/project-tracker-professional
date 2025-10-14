// src/components/TaskItem.jsx

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

export default function TaskItem({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTaskTitle, setLocalTaskTitle] = useState(task.title);
  const textareaRef = useRef(null);

  useEffect(() => {
    setLocalTaskTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [task.note]);

  const handleSaveEdit = () => {
    if (localTaskTitle.trim()) {
      onChange({ ...task, title: localTaskTitle.trim() });
      setIsEditing(false);
    }
  };

  // Install clsx if you haven't: npm install clsx
  return (
    <div
      className={clsx(
        "flex w-full items-center gap-4 rounded border px-4 py-2 transition-all",
        task.isDone ? "bg-green-100" : "bg-red-100"
      )}
    >
      {/* 1. Checkbox */}
      <input
        type="checkbox"
        checked={task.isDone}
        onChange={(e) => onChange({ ...task, isDone: e.target.checked })}
        className="h-5 w-5 shrink-0"
      />

      {/* 2. Task Title (View or Edit mode) */}
      <div className="flex min-w-[150px] items-center gap-2">
        {!isEditing ? (
          <>
            <p
              className={clsx(
                "font-medium",
                task.isDone ? "text-gray-500 line-through" : "text-black"
              )}
            >
              {task.title}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Task"
            >
              ✏️
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={localTaskTitle}
              onChange={(e) => setLocalTaskTitle(e.target.value)}
              className="rounded border-b border-gray-400 bg-white px-2 py-1 focus:outline-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            />
            <button
              className="text-green-600"
              onClick={handleSaveEdit}
              title="Save"
            >
              ✔️
            </button>
          </>
        )}
      </div>

      {/* 3. Notes Textarea */}
      <textarea
        ref={textareaRef}
        value={task.note}
        onChange={(e) => onChange({ ...task, note: e.target.value })}
        placeholder="Notes..."
        rows={1}
        className="flex-1 rounded border border-gray-300 p-1 text-sm"
      />

      {/* 4. Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
        title="Delete Task"
      >
        ❌
      </button>
    </div>
  );
}
