import { db } from "../database.js";

export const addTransaction = async (req, res) => {
  const { type, category, amount } = req.body;

  await db.query(
    "INSERT INTO transactions(user_id,type,category,amount) VALUES ($1,$2,$3,$4)",
    [req.user.id, type, category, amount]
  );

  res.json({ message: "Transaction added" });
};

export const getTransactions = async (req, res) => {
  const data = await db.query(
    "SELECT * FROM transactions WHERE user_id=$1 ORDER BY date DESC",
    [req.user.id]
  );

  res.json(data.rows);
};
