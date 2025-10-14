export default function ProjectList({
  projects,
  onSelect,
  selectedId,
  onToggleComplete,
}) {
  return (
    <div className="bg-white rounded shadow p-2">
      <h2 className="font-bold mb-2">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500 text-sm">No projects yet.</p>
      ) : (
        <ul style={{ listStyleType: "none" }}>
          {projects.map((p) => (
            <li
              key={p._id}
              onClick={() => onSelect(p)}
              className={`p-2 cursor-pointer rounded flex items-center gap-2 
                ${selectedId === p._id ? "bg-blue-100" : "hover:bg-gray-100"}
                ${p.isCompleted ? "line-through text-gray-500" : ""}`}
            >
              {/* Hidden radio-like indicator */}
              <input
                type="radio"
                name="selectedProject"
                checked={selectedId === p._id}
                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-none"
                readOnly
              />
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
