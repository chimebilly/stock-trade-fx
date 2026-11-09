const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");

const app = express();

app.use(helmet());
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100
}));

const PORT = process.env.PORT || 3000;

let db = null;

if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

app.get("/", (req, res) => {
  res.send("STOCK TRADE FX server is running.");
});

app.get("/health", async (req, res) => {
  try {
    if (db) {
      await db.query("SELECT 1");
      return res.json({
        status: "healthy",
        database: "connected"
      });
    }

    res.json({
      status: "running",
      database: "not configured"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "connection failed"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`STOCK TRADE FX running on port ${PORT}`);
});
