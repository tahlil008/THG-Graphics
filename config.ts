
/**
 * 🛠️ HOW TO SYNC DATA ACROSS DEVICES:
 * 
 * 1. Go to https://supabase.com and create a FREE account.
 * 2. Create a "New Project".
 * 3. Go to "Project Settings" (Gear icon) -> "API".
 * 4. Copy "Project URL" and "anon public" key.
 * 5. Paste them below.
 * 6. Go to "SQL Editor" in Supabase and run the SQL code below.
 */

export const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // Paste URL here
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Paste Anon Key here

/* 
COPY AND RUN THIS IN SUPABASE SQL EDITOR:

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  client_name TEXT,
  email TEXT,
  whatsapp TEXT,
  phone TEXT,
  project_type TEXT,
  details TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'Pending',
  created_at BIGINT
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON orders FOR DELETE USING (true);

-- Enable Realtime for the orders table
alter publication supabase_realtime add table orders;
*/
