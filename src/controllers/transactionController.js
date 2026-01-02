import { db } from "../database.js";

export const addTransaction = async (req, res) => {
  if (req.user.role === "read-only") {
    return res.status(403).json({ message: "Read-only users cannot add transactions" });
  }

  const { type, category, amount } = req.body;

  await db.query(
    "INSERT INTO transactions(user_id, type, category, amount) VALUES ($1,$2,$3,$4)",
    [req.user.id, type, category, amount]
  );

  res.json({ message: "Transaction added" });
};

export const getTransactions = async (req, res) => {
  const { type, category, min, max, page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  let baseQuery = "FROM transactions WHERE 1=1";
  const params = [];

  if (type) {
    params.push(type);
    baseQuery += ` AND type=$${params.length}`;
  }

  if (category) {
    params.push(category);
    baseQuery += ` AND category=$${params.length}`;
  }

  if (min) {
    params.push(min);
    baseQuery += ` AND amount >= $${params.length}`;
  }

  if (max) {
    params.push(max);
    baseQuery += ` AND amount <= $${params.length}`;
  }

  // 1️⃣ Total count
  const totalRes = await db.query(`SELECT COUNT(*) ${baseQuery}`, params);
  const total = parseInt(totalRes.rows[0].count);

  // 2️⃣ Paginated data
  params.push(limit, offset);

  const dataRes = await db.query(
    `SELECT * ${baseQuery} ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  res.json({
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: dataRes.rows,
  });
};


// UPDATE
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, amount } = req.body;

  if (req.user.role === "read-only") {
    return res.status(403).json({ message: "Read-only cannot update transactions" });
  }

  if (req.user.role === "admin") {
    await db.query(
      "UPDATE transactions SET type=$1, category=$2, amount=$3 WHERE id=$4",
      [type, category, amount, id]
    );
    return res.json({ message: "Transaction updated by admin" });
  }

  const check = await db.query(
    "SELECT * FROM transactions WHERE id=$1 AND user_id=$2",
    [id, req.user.id]
  );

  if (!check.rows.length) {
    return res.status(403).json({
      message: "You cannot edit someone else's transaction",
    });
  }

  await db.query(
    "UPDATE transactions SET type=$1, category=$2, amount=$3 WHERE id=$4",
    [type, category, amount, id]
  );

  res.json({ message: "Transaction updated" });
};

// DELETE
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (req.user.role === "read-only") {
    return res.status(403).json({ message: "Read-only cannot delete transactions" });
  }

  if (req.user.role === "admin") {
    await db.query("DELETE FROM transactions WHERE id=$1", [id]);
    return res.json({ message: "Transaction deleted by admin" });
  }

  const check = await db.query(
    "SELECT * FROM transactions WHERE id=$1 AND user_id=$2",
    [id, req.user.id]
  );

  if (!check.rows.length) {
    return res.status(403).json({
      message: "You cannot delete someone else's transaction",
    });
  }

  await db.query("DELETE FROM transactions WHERE id=$1", [id]);
  res.json({ message: "Transaction deleted" });
};
