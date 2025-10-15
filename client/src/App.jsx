import { useState, useEffect } from "react";
import axios from "axios";
import ProjectList from "./components/ProjectList";
import ProjectBoard from "./components/ProjectBoard";
// App.js
import "./App.css";
function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API = "https://project-tracker-api-ie1b.onrender.com/api/projects"; // 👈 Use your Render URL here

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (name) => {
    try {
      await axios.post(API, { name });
      fetchProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  const handleTasksChange = async (projectId, newTasks) => {
    try {
      await axios.put(`${API}/${projectId}`, { tasks: newTasks });
      fetchProjects();
    } catch (err) {
      console.error("Error updating tasks", err);
    }
  };

  const handleToggleProjectComplete = async (projectId, completed) => {
    try {
      await axios.put(`${API}/${projectId}`, { isCompleted: completed });
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, isCompleted: completed } : p
        )
      );
      if (selectedProject && selectedProject._id === projectId) {
        setSelectedProject({ ...selectedProject, isCompleted: completed });
      }
    } catch (err) {
      console.error("Error toggling project completion", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Project Task Tracker
      </h1>

      {/* --- Responsive Grid Container --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* --- PROJECT LIST (Column 1) --- */}
        <div className="md:col-span-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full shadow hover:bg-blue-700 transition-colors"
          >
            + New Project
          </button>
          <ProjectList
            projects={projects}
            onSelect={setSelectedProject}
            selectedId={selectedProject?._id}
            onToggleComplete={handleToggleProjectComplete}
          />
        </div>

        {/* --- PROJECT BOARD (Columns 2, 3, 4) --- */}
        <div className="md:col-span-3">
          {selectedProject ? (
            <ProjectBoard
              project={selectedProject}
              onTasksChange={handleTasksChange}
              onProjectUpdate={fetchProjects}
              onResetProject={() => setSelectedProject(null)}
            />
          ) : (
            <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow min-h-[300px]">
              <p className="text-gray-500 text-center text-lg">
                Select a project to view its tasks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL FOR NEW PROJECT (MOVED HERE) --- */}
      {/* 
        By moving the modal here, it is no longer a child of the `grid` container.
        It can now float freely over the page as intended, without interfering 
        with the main layout.
      */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Enter project name"
              id="projectName"
              className="border p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleCreateProject(
                    document.getElementById("projectName").value
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
