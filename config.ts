
/**
 * গুরুত্বপূর্ন নির্দেশাবলী:
 * ১. supabase.com এ গিয়ে একটি ফ্রী একাউন্ট খুলুন।
 * ২. একটি নতুন প্রজেক্ট তৈরি করুন।
 * ৩. Project Settings > API থেকে 'Project URL' এবং 'anon key' সংগ্রহ করুন।
 * ৪. নিচের ভেরিয়েবলগুলোতে সেগুলো বসিয়ে দিন।
 * ৫. Supabase এর SQL Editor এ নিচের কোডটি রান করুন টেবিল তৈরি করার জন্য।
 */

export const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // এখানে আপনার আসল URL দিন
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // এখানে আপনার আসল Key দিন

/* 
SUPABASE SQL EDITOR এ এই কোডটি কপি করে রান করুন:

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
*/
