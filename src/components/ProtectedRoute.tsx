import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { forwardRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer";
}

const ProtectedRoute = forwardRef<HTMLDivElement, ProtectedRouteProps>(
  ({ children, requiredRole }, _ref) => {
    const { user, role, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (requiredRole && role !== requiredRole) {
      return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
    }

    return <>{children}</>;
  }
);

ProtectedRoute.displayName = "ProtectedRoute";

export default ProtectedRoute;
