import { useContext, useEffect, useState } from "react";
import { api } from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function Transactions() {
  const { user } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [editData, setEditData] = useState(null);

  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

  // Load transactions
  const load = () => {
  api
    .get("/transactions", {
      params: {
        type: filterType,
        category: filterCategory,
        page,
        limit: 5, // per page items
      },
    })
    .then((res) => {
      setTransactions(res.data.data);
      setTotalPages(res.data.totalPages);
    });
};


  useEffect(() => {
    load();
  }, [page]);

  // Show read-only message
  const blockAction = () => {
    setErrorMsg("Read-only users cannot add, edit, or delete transactions.");
    setTimeout(() => setErrorMsg(""), 3000);
  };

  // ADD
  const addTransaction = async (e) => {
    e.preventDefault();
    if (user.role === "read-only") return blockAction();

    await api.post("/transactions", {
      type,
      category,
      amount,
    });

    setType("");
    setCategory("");
    setAmount("");
    load();
  };

  // DELETE
  const deleteTxn = async (id) => {
  if (user.role === "read-only") return blockAction();

  try {
    await api.delete(`/transactions/${id}`);
    load();
  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Delete failed");
    setTimeout(() => setErrorMsg(""), 3000);
  }
};


  // UPDATE
  const updateTxn = async (e) => {
  e.preventDefault();
  if (user.role === "read-only") return blockAction();

  try {
    await api.put(`/transactions/${editData.id}`, {
      type: editData.type,
      category: editData.category,
      amount: editData.amount,
    });

    setEditData(null);
    load();

  } catch (err) {
    setErrorMsg(err.response?.data?.message || "Update failed");
    setTimeout(() => setErrorMsg(""), 3000);
  }
};


  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <p className="text-red-600 mb-4 font-semibold">{errorMsg}</p>
        )}

        {/* ADD FORM — visible to all roles but disabled for read-only */}
        <form
          className="bg-white shadow-md p-4 rounded mb-6"
          onSubmit={addTransaction}
        >
          <div className="grid grid-cols-3 gap-4">
            <select
              className="border p-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={user.role === "read-only"}
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              className="border p-2"
              placeholder="Category"
              value={category}
              disabled={user.role === "read-only"}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="number"
              className="border p-2"
              placeholder="Amount"
              value={amount}
              disabled={user.role === "read-only"}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className={`px-4 py-2 rounded mt-4 text-white ${
              user.role === "read-only"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            }`}
            type="submit"
          >
            Add Transaction
          </button>
        </form>


        {/* FILTERS */}
<div className="flex gap-4 mb-6">

  <select
    className="border p-2"
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="">Type Filter</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <input
    className="border p-2"
    placeholder="Filter Category"
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  />

  <button
    onClick={load}
    className="bg-gray-800 text-white px-4 py-2 rounded"
  >
    Apply Filters
  </button>
</div>



        {/* TRANSACTION TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border text-center">
                <td className="p-2 capitalize">{txn.type}</td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">₹{txn.amount}</td>
                <td className="p-2">{new Date(txn.date).toLocaleString()}</td>

                <td className="p-2 flex justify-center gap-3">

                  {/* EDIT BUTTON */}
                  <button
  className={`px-3 py-1 rounded text-white ${
    user.role === "read-only"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600"
  }`}
  onClick={() => {
    if (user.role === "read-only") {
      blockAction(); // read-only not allowed
      return;
    }

    if (txn.user_id !== user.id && user.role === "user") {
      setErrorMsg("You cannot edit someone else's transactions");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    // admin or owner → allow edit
    setEditData(txn);
  }}
>
  Edit
</button>


                  {/* DELETE BUTTON */}
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      user.role === "read-only"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600"
                    }`}
                    onClick={() =>
                      user.role === "read-only"
                        ? blockAction()
                        : deleteTxn(txn.id)
                    }
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-4 mt-6">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className={`px-4 py-2 rounded ${
      page === 1 ? "bg-gray-400" : "bg-blue-600 text-white"
    }`}
  >
    Prev
  </button>

  <span className="font-semibold text-lg mt-2 text-center">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className={`px-4 py-2 rounded ${
      page === totalPages ? "bg-gray-400" : "bg-blue-600 text-white"
    }`}
  >
    Next
  </button>

</div>


        {/* EDIT MODAL */}
        {editData && user.role !== "read-only" && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form
              onSubmit={updateTxn}
              className="bg-white p-6 shadow rounded w-96"
            >
              <h2 className="text-xl mb-4">Edit Transaction</h2>

              <select
                className="border p-2 w-full mb-3"
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input
                className="border p-2 w-full mb-3"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
              />

              <input
                className="border p-2 w-full mb-3"
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
              />

              <div className="flex justify-between">
                <button
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                  onClick={() => setEditData(null)}
                  type="button"
                >
                  Cancel
                </button>

                <button className="bg-blue-600 text-white px-3 py-1 rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
