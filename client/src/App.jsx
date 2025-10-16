// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css"; // Your global stylesheet

// --- Import Pages and Route Components ---
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProjectTrackerPage from "./pages/ProjectTrackerPage";
import PrivateRoute from "./components/auth/PrivateRoute";

/**
 * App.jsx is the root component of the application.
 * It sets up the main router and provides the authentication context
 * to all child components.
 */
function App() {
  return (
    // The AuthProvider makes authentication state and functions
    // available to every component inside it.
    <AuthProvider>
      {/* The Router handles all URL-based navigation. */}
      <Router>
        {/* The Routes component is where you define your individual routes. */}
        <Routes>
          {/* --- Public Routes --- */}
          {/* These routes can be accessed by anyone, logged in or not. */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- Protected Route --- */}
          {/* This route is for the main application. It's wrapped in <PrivateRoute>. */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                {/* 
                  If the user is logged in, PrivateRoute will render this component.
                  If not, PrivateRoute will redirect them to the /login page.
                */}
                <ProjectTrackerPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
