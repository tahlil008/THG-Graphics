
// Go to https://supabase.com, create a project, and get these from Project Settings > API
export const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

/* 
SQL TO RUN IN SUPABASE SQL EDITOR:

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
*/
