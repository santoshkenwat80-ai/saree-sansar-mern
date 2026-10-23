import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/common/Loader";
import toast from "react-hot-toast";
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      toast.error("Administrative access required");
    }
  }, [loading, isAuthenticated, isAdmin]);
  if (loading) {
    return <Loader message="Verifying administrative access..." />;
  }
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
