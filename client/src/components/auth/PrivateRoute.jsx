import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; // Adjust path if needed

/**
 * A wrapper component that checks for user authentication.
 * If the user is authenticated, it renders the child components.
 * Otherwise, it redirects the user to the login page.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactElement} The child components or a redirect component.
 */
const PrivateRoute = ({ children }) => {
  // 1. Get the authentication token from our global AuthContext.
  const { token } = useAuth();

  // 2. The core logic:
  //    - If a 'token' exists, the user is considered logged in.
  //      In this case, we render the 'children' components that were passed in.
  //      (In App.jsx, this will be the <ProjectTrackerPage /> component).
  //
  //    - If 'token' is null or undefined, the user is not logged in.
  //      In this case, we render the <Navigate> component from react-router-dom.
  //      This component will automatically redirect the user to the "/login" route.
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
