import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import notify from "@/utils/notifications.jsx";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  allowAdmin = false,
}) => {
  const { role: urlRole } = useParams();
  const { isAuthenticated, user, loading, sessionExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-[#1E3A8A]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-[#475569]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show session expired message if applicable
    if (sessionExpired) {
      notify.warning(
        "Session Expired",
        "Your session has expired. Please login again.",
      );
    }
    // Redirect to login, save intended location
    return (
      <Navigate
        to="/login"
        state={{ from: location, sessionExpired }}
        replace
      />
    );
  }

  // Validate URL role if present
  if (urlRole && user?.role) {
    const userRoleLower = user.role.toLowerCase();
    const urlRoleLower = urlRole.toLowerCase();

    if (userRoleLower !== urlRoleLower) {
      // Role mismatch - redirect to correct role dashboard
      const correctDashboard =
        userRoleLower === "admin" ? "/admin" : `/${userRoleLower}/home`;
      return <Navigate to={correctDashboard} replace />;
    }
  }

  if (requireAdmin && user?.role !== "admin") {
    // Redirect to home if not admin
    const userRolePath = user?.role?.toLowerCase() || 'buyer';
    return <Navigate to={`/${userRolePath}/home`} replace />;
  }

  // Admin trying to access user routes - redirect to admin dashboard (unless allowAdmin is true)
  if (!requireAdmin && !allowAdmin && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
