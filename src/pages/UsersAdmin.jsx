import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-3xl mb-5">All Users (Admin Only)</h1>

        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border text-center">
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  );
}
