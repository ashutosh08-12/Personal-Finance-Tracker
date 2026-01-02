import { db } from "../database.js";

export const getAllUsers = async (req, res) => {
  const result = await db.query(
    "SELECT id, name, email, role FROM users ORDER BY id ASC"
  );

  res.json(result.rows);
};
