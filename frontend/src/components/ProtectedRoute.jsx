import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking your session" />;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Not permitted</h1>
        <p className="text-ink-soft dark:text-paper/70">
          Your account role ({user.role}) doesn't have access to this page.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
