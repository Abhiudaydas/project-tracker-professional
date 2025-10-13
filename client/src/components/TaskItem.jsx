export default function TaskItem({ task, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-3 border p-3 rounded bg-gray-50">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.isDone}
        onChange={(e) => onChange({ ...task, isDone: e.target.checked })}
        className="w-5 h-5"
      />

      <div className="flex-1">
        {/* Task Title */}
        <input
          type="text"
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className={`w-full border-b border-dashed border-gray-300 focus:border-blue-500 outline-none
            ${task.isDone ? "line-through text-gray-400" : ""}`}
          disabled={task.isDone}
        />

        {/* Note */}
        <textarea
          value={task.note}
          onChange={(e) => onChange({ ...task, note: e.target.value })}
          placeholder="Add notes..."
          className="w-full mt-1 text-sm text-gray-600 border rounded p-1"
          rows="1"
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 transition-all"
        title="Delete Task"
      >
        ❌
      </button>
    </div>
  );
}
