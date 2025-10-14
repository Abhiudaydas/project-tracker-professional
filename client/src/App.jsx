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

  const API = "http://localhost:5000/api/projects";

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
    <div className="min-h-screen bg-gray-100 p-6 ">
      <h1 className="main_h">Project Task Tracker</h1>

      <div className="flex gap-6">
        {/*---------- PROJECT LIST ----------*/}
        <div className="w-1/4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full"
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

        {/*---------- MODAL FOR NEW PROJECT ----------*/}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">New Project</h2>
              <input
                type="text"
                placeholder="Enter project name"
                id="projectName"
                className="border p-2 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleCreateProject(
                      document.getElementById("projectName").value
                    )
                  }
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/*---------- PROJECT BOARD ----------*/}
        <div className="w-3/4">
          {selectedProject ? (
            <ProjectBoard
              project={selectedProject}
              onTasksChange={handleTasksChange}
              onProjectUpdate={fetchProjects}
              onResetProject={() => setSelectedProject(null)} // ✅ added
            />
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Select a project to view tasks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
