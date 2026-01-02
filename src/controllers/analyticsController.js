import { db } from "../database.js";
import redis from "../redisClient.js";

const CACHE_15_MIN = 60 * 15;
const CACHE_1_HOUR = 60 * 60;

/* ---------------- SAFE REDIS HELPERS ---------------- */

const redisGetSafe = async (key) => {
  try {
    return await redis.get(key);
  } catch (err) {
    console.error("Redis GET failed:", err.message);
    return null;
  }
};

const redisSetSafe = async (key, ttl, value) => {
  try {
    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    // READ-ONLY Redis → ignore
    console.error("Redis SETEX skipped:", err.message);
  }
};

const redisDelSafe = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error("Redis DEL skipped:", err.message);
  }
};

/* ---------------- SUMMARY ---------------- */

export const getSummary = async (req, res) => {
  try {
    const cacheKey = "analytics:summary";

    const cached = await redisGetSafe(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const data = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount END), 0) AS income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0) AS expense
      FROM transactions
    `);

    const result = data.rows[0];
    await redisSetSafe(cacheKey, CACHE_15_MIN, result);

    res.json(result);
  } catch (err) {
    console.error("getSummary error:", err.message);
    res.status(500).json({ message: "Failed to fetch summary analytics" });
  }
};

/* ---------------- CATEGORY ---------------- */

export const getCategoryAnalytics = async (req, res) => {
  try {
    const cacheKey = "analytics:category";

    const cached = await redisGetSafe(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const data = await db.query(`
      SELECT category, SUM(amount)::numeric AS total
      FROM transactions
      GROUP BY category
      ORDER BY total DESC
    `);

    await redisSetSafe(cacheKey, CACHE_1_HOUR, data.rows);
    res.json(data.rows);
  } catch (err) {
    console.error("getCategoryAnalytics error:", err.message);
    res.status(500).json({ message: "Failed to fetch category analytics" });
  }
};

/* ---------------- MONTHLY ---------------- */

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const cacheKey = "analytics:monthly";

    const cached = await redisGetSafe(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const data = await db.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(CASE WHEN type='income' THEN amount END) AS income,
        SUM(CASE WHEN type='expense' THEN amount END) AS expense
      FROM transactions
      GROUP BY month
      ORDER BY month ASC
    `);

    await redisSetSafe(cacheKey, CACHE_1_HOUR, data.rows);
    res.json(data.rows);
  } catch (err) {
    console.error("getMonthlyAnalytics error:", err.message);
    res.status(500).json({ message: "Failed to fetch monthly analytics" });
  }
};

/* ---------------- YEARLY ---------------- */

export const getYearlyAnalytics = async (req, res) => {
  try {
    const cacheKey = "analytics:yearly";

    const cached = await redisGetSafe(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const data = await db.query(`
      SELECT
        DATE_PART('year', date) AS year,
        SUM(CASE WHEN type='income' THEN amount END) AS income,
        SUM(CASE WHEN type='expense' THEN amount END) AS expense
      FROM transactions
      GROUP BY year
      ORDER BY year ASC
    `);

    await redisSetSafe(cacheKey, CACHE_1_HOUR, data.rows);
    res.json(data.rows);
  } catch (err) {
    console.error("getYearlyAnalytics error:", err.message);
    res.status(500).json({ message: "Failed to fetch yearly analytics" });
  }
};

/* ---------------- CACHE INVALIDATION ---------------- */

export const invalidateAnalyticsCache = async () => {
  await redisDelSafe("analytics:summary");
  await redisDelSafe("analytics:monthly");
  await redisDelSafe("analytics:yearly");
  await redisDelSafe("analytics:category");
};
