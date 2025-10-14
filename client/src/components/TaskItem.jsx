import { useState, useEffect, useRef } from "react";

export default function TaskItem({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTaskTitle, setLocalTaskTitle] = useState(task.title);
  const textareaRef = useRef(null);

  useEffect(() => {
    autoResizeTextarea();
  }, [task.note]);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    onChange({ ...task, title: localTaskTitle });
  };

  return (
    <div className="flex items-start gap-3 border p-3 rounded bg-gray-50">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.isDone}
        onChange={(e) => onChange({ ...task, isDone: e.target.checked })}
        className="w-5 h-5 mt-1"
      />

      {/* Task Content */}
      <div className="flex-1">
        {/* Title Display or Edit Mode */}
        {!isEditing ? (
          <div className="flex justify-between items-center">
            <p
              className={`text-base ${
                task.isDone ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              title="Edit task"
              className="ml-2 text-blue-600 hover:text-blue-800 transition"
            >
              ✏️
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={localTaskTitle}
              onChange={(e) => setLocalTaskTitle(e.target.value)}
              className="w-full border-b focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-800"
              title="Save"
            >
              ✔️
            </button>
          </div>
        )}

        {/* Note Textarea */}
        <textarea
          ref={textareaRef}
          value={task.note}
          onChange={(e) => {
            autoResizeTextarea();
            onChange({ ...task, note: e.target.value });
          }}
          placeholder="Add notes..."
          className="w-full mt-1 text-sm text-gray-600 border rounded p-1 resize-none overflow-hidden"
          rows={1}
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 transition-all mt-1"
        title="Delete Task"
      >
        ❌
      </button>
    </div>
  );
}
