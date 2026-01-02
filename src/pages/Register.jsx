import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      setMessage("Registration successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setMessage("Error: " + err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-7 shadow-lg w-96 rounded">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        {message && (
          <p className="mb-3 text-blue-600 font-medium">{message}</p>
        )}

        <input
          className="border p-2 w-full mb-3"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="border p-2 w-full mb-4"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="read-only">Read-Only</option>
        </select>

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Register
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
