import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex gap-5">
        <Link to="/dashboard">Dashboard</Link>
        {/* <Link to="/analytics">Analytics</Link> */}
        <Link to="/transactions">Transactions</Link>
        {user?.role === "admin" && (
          <Link to="/admin/users">Users</Link>
        )}
      </div>

      <button
        onClick={logout}
        className="bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
