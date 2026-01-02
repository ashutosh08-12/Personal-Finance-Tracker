import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

   if (user === null) return null;

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return (
      <h1 className="text-center mt-20 text-3xl text-red-500">
        Access Denied (Role Protected)
      </h1>
    );
  }

  return children;
}
