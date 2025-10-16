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
        "flex w-full flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border px-4 py-3 transition-all",
        task.isDone
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      )}
    >
      {/* 
        Container classes explained:
        - flex-wrap: The key! Allows items to wrap onto the next line on small screens.
        - items-center: Keeps items vertically aligned in the middle.
        - gap-x-4: Sets the horizontal gap between items.
        - gap-y-3: Sets the vertical gap ONLY when items wrap to a new line.
      */}

      {/* --- Main Task Info & Actions (Top Row on Mobile) --- */}
      <div className="flex w-full items-center gap-4 md:w-auto md:flex-none">
        {/* 
          This wrapper groups the checkbox, title, and delete button.
          - w-full md:w-auto: Takes full width on mobile (pushing notes down), but only the space it needs on desktop.
        */}

        {/* 1. Checkbox */}
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={(e) => onChange({ ...task, isDone: e.target.checked })}
          className="h-5 w-5 shrink-0 cursor-pointer"
        />

        {/* 2. Task Title (View or Edit mode) */}
        <div className="flex flex-grow items-center gap-2">
          {/* flex-grow: Makes the title area take up all available space in this group */}
          {!isEditing ? (
            <>
              <p
                className={clsx(
                  "font-medium",
                  task.isDone ? "text-gray-500 line-through" : "text-gray-800"
                )}
              >
                {task.title}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="shrink-0 text-blue-600 hover:text-blue-800"
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
                className="w-full rounded border-b border-gray-400 bg-white px-2 py-1 focus:outline-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
              <button
                className="shrink-0 text-green-600"
                onClick={handleSaveEdit}
                title="Save"
              >
                ✔️
              </button>
            </>
          )}
        </div>

        {/* 4. Delete Button (Moved inside the top group for better mobile layout) */}
        <button
          onClick={() => onDelete(task.id)}
          className="ml-auto shrink-0 text-red-500 hover:text-red-700 md:ml-0"
          title="Delete Task"
        >
          {/* ml-auto: Pushes the delete button to the far right on mobile
              md:ml-0: Resets the margin on desktop */}
          ❌
        </button>
      </div>

      {/* --- 3. Notes Textarea (Bottom Row on Mobile) --- */}
      <textarea
        ref={textareaRef}
        value={task.note}
        onChange={(e) => onChange({ ...task, note: e.target.value })}
        placeholder="Add notes..."
        rows={1}
        className="w-full flex-1 rounded border border-gray-300 p-2 text-sm transition-all focus:ring-2 focus:ring-blue-400 md:w-auto"
      >
        {/*
          - w-full md:w-auto: Full width on mobile, auto width on desktop.
          - flex-1: On desktop, this makes the textarea grow to fill the remaining space.
        */}
      </textarea>
    </div>
  );
}
