const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 3000);

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "changeme",
  database: process.env.DB_NAME || "appdb",
  max: 5,
  connectionTimeoutMillis: 2000
});

app.get("/", (_req, res) => {
  res.json({
    application: "Fluid AI DevOps Challenge",
    status: "running",
    version: process.env.APP_VERSION || "local"
  });
});

app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "alive" });
});

app.get("/health/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready", database: "connected" });
  } catch (_error) {
    res.status(503).json({ status: "not-ready", database: "unavailable" });
  }
});

app.get("/api/items", async (_req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS demo_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const count = await pool.query("SELECT COUNT(*)::int AS count FROM demo_items");
    if (count.rows[0].count === 0) {
      await pool.query("INSERT INTO demo_items (name) VALUES ($1), ($2)", [
        "Kubernetes",
        "CI/CD"
      ]);
    }

    const result = await pool.query(
      "SELECT id, name, created_at FROM demo_items ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database request failed:", error.message);
    res.status(500).json({ error: "database request failed" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on port ${port}`);
});
