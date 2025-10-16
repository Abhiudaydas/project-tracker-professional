import clsx from "clsx";

export default function ProjectList({
  projects,
  onSelect,
  selectedId,
  onToggleComplete,
}) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-bold text-lg text-center mb-4">Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-sm">No projects yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-3 list-none px-0">
          {projects.map((p) => (
            <li
              key={p._id}
              onClick={() => onSelect(p)}
              className={clsx(
                "p-3 rounded border shadow-sm transition-colors hover:shadow-md flex items-center gap-2 project-item",
                selectedId === p._id ? "bg-blue-100" : "hover:bg-gray-100",
                p.isCompleted && "line-through text-gray-500"
              )}
              title="Click to select project"
            >
              <input
                type="radio"
                name="selectedProject"
                checked={selectedId === p._id}
                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-none"
                readOnly
              />
              <span className="truncate">{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
