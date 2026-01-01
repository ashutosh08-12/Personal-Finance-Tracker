import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)",
    [name, email, hashed, role || "user"]
  );

  res.json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const userRes = await db.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!userRes.rows.length) return res.status(404).json({ message: "User not found" });

  const user = userRes.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};
