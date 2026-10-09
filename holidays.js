// API วันหยุด: GET = ทุกคนดูได้ / POST, DELETE = ต้องมีรหัสผู้ดูแล
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const rows = await sql`SELECT to_char(holiday_date,'YYYY-MM-DD') AS date, name FROM holidays ORDER BY holiday_date`;
      return res.status(200).json(rows);
    }

    // ส่วนที่แก้ไขข้อมูล ต้องตั้ง ADMIN_PASSWORD และส่งรหัสให้ตรง
    const admin = process.env.ADMIN_PASSWORD;
    if (!admin || req.headers["x-admin-password"] !== admin) {
      return res.status(401).json({ error: "รหัสผู้ดูแลไม่ถูกต้อง" });
    }
    const { date, name } = req.body || {};
    if (!isDate(date)) return res.status(400).json({ error: "รูปแบบวันที่ไม่ถูกต้อง" });

    if (req.method === "POST") {
      await sql`INSERT INTO holidays (holiday_date, name) VALUES (${date}, ${name || ""})
                ON CONFLICT (holiday_date) DO UPDATE SET name = EXCLUDED.name`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === "DELETE") {
      await sql`DELETE FROM holidays WHERE holiday_date = ${date}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "ไม่รองรับวิธีนี้" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์" });
  }
}
