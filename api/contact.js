import { Pool } from "pg";

// Подключение к Neon через env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });

  try {
    // Вставляем данные в таблицу contact
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id",
      [name, email, message]
    );

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
}
