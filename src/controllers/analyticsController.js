import { db } from "../database.js";
import { redis } from "../redisClient.js";


const CACHE_15_MIN = 60 * 15; 
const CACHE_1_HOUR = 60 * 60; 

export const getSummary = async (req, res) => {
  const cacheKey = `analytics:summary`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await db.query(
    `SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount END), 0) AS income,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0) AS expense
     FROM transactions`
  );

  await redis.setEx(cacheKey, CACHE_15_MIN, JSON.stringify(data.rows[0]));

  res.json(data.rows[0]);
};

export const getCategoryAnalytics = async (req, res) => {
  const cacheKey = `analytics:category`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await db.query(
    `SELECT category, SUM(amount)::numeric AS total
     FROM transactions
     GROUP BY category
     ORDER BY total DESC`
  );

  await redis.setEx(cacheKey, CACHE_1_HOUR, JSON.stringify(data.rows));

  res.json(data.rows);
};

export const getMonthlyAnalytics = async (req, res) => {
  const cacheKey = `analytics:monthly`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await db.query(
    `SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(CASE WHEN type='income' THEN amount END) AS income,
        SUM(CASE WHEN type='expense' THEN amount END) AS expense
     FROM transactions
     GROUP BY month
     ORDER BY month ASC`
  );

  await redis.setEx(cacheKey, CACHE_1_HOUR, JSON.stringify(data.rows));

  res.json(data.rows);
};

export const getYearlyAnalytics = async (req, res) => {
  const cacheKey = `analytics:yearly`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await db.query(
    `SELECT
        DATE_PART('year', date) AS year,
        SUM(CASE WHEN type='income' THEN amount END) AS income,
        SUM(CASE WHEN type='expense' THEN amount END) AS expense
     FROM transactions
     GROUP BY year
     ORDER BY year ASC`
  );

  await redis.setEx(cacheKey, CACHE_1_HOUR, JSON.stringify(data.rows));

  res.json(data.rows);
};

export const invalidateAnalyticsCache = async () => {
  await redis.del(`analytics:summary`);
  await redis.del(`analytics:monthly`);
  await redis.del(`analytics:yearly`);
  await redis.del(`analytics:category`);
};
