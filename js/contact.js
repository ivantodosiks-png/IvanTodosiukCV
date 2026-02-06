import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // твой URL из Vercel
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required" });

  try {
    // Вставка в таблицу contacts в схеме public
    const result = await pool.query(
      "INSERT INTO public.contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    console.log("Inserted row:", result.rows[0]); // логируем вставку
    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Database error:", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
