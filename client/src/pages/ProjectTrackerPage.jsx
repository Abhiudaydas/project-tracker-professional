import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import your components
import ProjectList from "../components/project/ProjectList";
import ProjectBoard from "../components/project/ProjectBoard";

const ProjectTrackerPage = () => {
  // --- STATE MANAGEMENT ---
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- HOOKS ---
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  // Define your API URL (use your deployed URL when you are ready)
  const API_BASE_URL = "https://project-tracker-api-ie1b.onrender.com/api";

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    if (token) {
      const fetchProjectsForUser = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/projects`);
          setProjects(res.data);
        } catch (err) {
          console.error("Error fetching projects", err);
          if (err.response && err.response.status === 401) {
            logout();
            navigate("/login");
          }
        }
      };
      fetchProjectsForUser();
    }
  }, [token, logout, navigate]);

  // --- EVENT HANDLER FUNCTIONS ---
  const handleCreateProject = async (name) => {
    if (!name.trim()) return; // Prevent creating empty projects
    try {
      const res = await axios.post(`${API_BASE_URL}/projects`, { name });
      // Add the new project to the top of the list for immediate feedback
      setProjects([res.data, ...projects]);
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  const handleTasksChange = async (projectId, newTasks) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/projects/${projectId}`, {
        tasks: newTasks,
      });
      // Update the specific project in the state to avoid a full refetch
      const updatedProjects = projects.map((p) =>
        p._id === projectId ? res.data : p
      );
      setProjects(updatedProjects);
      // Also update the selected project if it's the one being changed
      if (selectedProject?._id === projectId) {
        setSelectedProject(res.data);
      }
    } catch (err) {
      console.error("Error updating tasks", err);
    }
  };

  const handleProjectUpdate = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error refetching projects after update", err);
    }
  };

  const handleToggleProjectComplete = async (projectId, isCompleted) => {
    try {
      await axios.put(`${API_BASE_URL}/projects/${projectId}`, { isCompleted });
      const updatedProjects = projects.map((p) =>
        p._id === projectId ? { ...p, isCompleted } : p
      );
      setProjects(updatedProjects);
      if (selectedProject && selectedProject._id === projectId) {
        setSelectedProject({ ...selectedProject, isCompleted });
      }
    } catch (err) {
      console.error("Error toggling project completion", err);
    }
  };

  const handleLogout = () => {
    logout();
    setProjects([]);
    setSelectedProject(null);
    navigate("/login");
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-lg font-medium text-gray-700">
              Hey, {user.name}!
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* --- Left Column: Project List --- */}
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

        {/* --- Right Column: Project Board or Placeholder --- */}
        <div className="md:col-span-3">
          {selectedProject ? (
            <ProjectBoard
              project={selectedProject}
              onTasksChange={handleTasksChange}
              onProjectUpdate={handleProjectUpdate}
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

      {/* --- New Project Modal (THIS IS THE PART THAT WAS LIKELY MISSING) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Enter project name"
              id="projectName"
              className="border p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateProject(
                    document.getElementById("projectName").value
                  );
                }
              }}
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
};

export default ProjectTrackerPage;
