-- รันใน Neon > SQL Editor หนึ่งครั้ง เพื่อสร้างตารางวันหยุด
CREATE TABLE IF NOT EXISTS holidays (
  holiday_date date PRIMARY KEY,
  name text NOT NULL DEFAULT ''
);
-- ข้อมูลตัวอย่างสมมติ (แก้/ลบได้ภายหลังจากหน้าเว็บ)
INSERT INTO holidays (holiday_date, name) VALUES
  ('2026-10-13', 'วันนวมินทรมหาราช'),
  ('2026-10-23', 'วันปิยมหาราช')
ON CONFLICT DO NOTHING;
