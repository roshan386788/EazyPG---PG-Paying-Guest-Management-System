import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "OWNER") return <Navigate to="/pg-owner" replace />;
    if (role === "TENANT") return <Navigate to="/tenant" replace />;
  }

  return children;
};

export default PublicRoute;
