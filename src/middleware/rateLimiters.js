import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "Too many login/register attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Transaction request limit reached for this hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    message: "Analytics request limit reached for this hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
