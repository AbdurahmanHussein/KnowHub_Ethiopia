-- ==========================================
-- KnowHub Ethiopia — Supabase Database Schema
-- ==========================================

-- 1. Create Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  curriculum TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  established INTEGER,
  student_count INTEGER,
  phone TEXT,
  email TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  region TEXT NOT NULL,
  amount TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT,
  link TEXT,
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline DATE NOT NULL,
  duration TEXT NOT NULL,
  link TEXT,
  required_skills TEXT[] DEFAULT '{}',
  posted_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL,
  platform TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  why_useful TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  size TEXT,
  pages INTEGER,
  slides INTEGER,
  source TEXT,
  description TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,          -- Telegram User ID or unique guest identifier
  item_id TEXT NOT NULL,          -- ID of the school/scholarship/opportunity/skill
  item_type TEXT NOT NULL,        -- 'school', 'scholarship', 'opportunity', 'skill', 'resource'
  item_title TEXT NOT NULL,       -- Cache the title for easier list rendering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id, item_type)
);

-- 7. Create User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,       -- Telegram User ID or unique guest identifier
  username TEXT,
  first_name TEXT,
  grade_level TEXT DEFAULT 'all', -- 'middle', 'high', 'university', 'all'
  preferred_subjects TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',     -- 'en' or 'am' (Amharic)
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (optional but default in Supabase)
-- For absolute simplicity for the user, we will keep policies highly open.
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create Open Select Policies for public data
CREATE POLICY "Allow public read access to schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Allow public read access to scholarships" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Allow public read access to opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access to resources" ON resources FOR SELECT USING (true);

-- Create Write/Seeding Policies for public data
CREATE POLICY "Allow public insert to schools" ON schools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to scholarships" ON scholarships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to resources" ON resources FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete of schools" ON schools FOR DELETE USING (true);
CREATE POLICY "Allow public delete of scholarships" ON scholarships FOR DELETE USING (true);
CREATE POLICY "Allow public delete of opportunities" ON opportunities FOR DELETE USING (true);
CREATE POLICY "Allow public delete of skills" ON skills FOR DELETE USING (true);
CREATE POLICY "Allow public delete of resources" ON resources FOR DELETE USING (true);

-- Create Read/Write Policies for Bookmarks & Profiles (user specific)
CREATE POLICY "Allow all access to bookmarks" ON bookmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
