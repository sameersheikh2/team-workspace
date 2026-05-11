import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests from this IP address",
    retryAfter: "15 minutes",
    documentation: "https://api.example.com/docs/rate-limits",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests from this IP, please try again later",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },
});

export default limiter;
