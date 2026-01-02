import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersAdmin from "./pages/UsersAdmin";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route
  path="/analytics"
  element={
    <ProtectedRoute roles={["admin", "user", "read-only"]}>
      <Analytics />
    </ProtectedRoute>
  }
/>

          <Route path="/transactions" element={
            <ProtectedRoute roles={["admin", "user", "read-only"]}>
              <Transactions />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute roles={["admin"]}>
              <UsersAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
