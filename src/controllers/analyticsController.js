import { db } from "../database.js";
import { redis } from "../redisClient.js";

export const getAnalytics = async (req, res) => {
  const key = `analytics:${req.user.id}`;

  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  const income = await db.query(
    "SELECT SUM(amount) FROM transactions WHERE user_id=$1 AND type='income'",
    [req.user.id]
  );

  const expense = await db.query(
    "SELECT SUM(amount) FROM transactions WHERE user_id=$1 AND type='expense'",
    [req.user.id]
  );

  const result = {
    income: income.rows[0].sum || 0,
    expense: expense.rows[0].sum || 0,
  };

  await redis.setEx(key, 900, JSON.stringify(result));

  res.json(result);
};
