-- ==========================================
-- KnowHub Ethiopia — Supabase Database Schema
-- ==========================================

-- 1. Create Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  acceptance_rate TEXT NOT NULL,
  focus_popularity TEXT NOT NULL,
  scholarship_details TEXT NOT NULL,
  ethiopian_success TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  phone TEXT,
  email TEXT,
  description TEXT,
  link TEXT,
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

-- 7. Create User Profiles Table (with admin flag for Phase 3)
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,       -- Telegram User ID or unique guest identifier
  username TEXT,
  first_name TEXT,
  grade_level TEXT DEFAULT 'all', -- 'middle', 'high', 'university', 'all'
  preferred_subjects TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en',     -- 'en' or 'am' (Amharic)
  is_admin BOOLEAN DEFAULT false, -- Phase 3: Admin Console access flag
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Create Likes Table (Phase 3: Social interactions)
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,        -- 'school', 'scholarship', 'opportunity', 'skill', 'resource'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_id, item_type)
);

-- 9. Create Comments Table (Phase 3: Discussion boards)
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,        -- 'school', 'scholarship', 'opportunity', 'skill', 'resource'
  username TEXT,
  first_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (optional but default in Supabase)
-- For absolute simplicity for the user, we will keep policies highly open.
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create Open Select Policies for public data
CREATE POLICY "Allow public read access to institutions" ON institutions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to scholarships" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Allow public read access to opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access to resources" ON resources FOR SELECT USING (true);

-- Create Write/Seeding Policies for public data
CREATE POLICY "Allow public insert to institutions" ON institutions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to scholarships" ON scholarships FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to skills" ON skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to resources" ON resources FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete of institutions" ON institutions FOR DELETE USING (true);
CREATE POLICY "Allow public delete of scholarships" ON scholarships FOR DELETE USING (true);
CREATE POLICY "Allow public delete of opportunities" ON opportunities FOR DELETE USING (true);
CREATE POLICY "Allow public delete of skills" ON skills FOR DELETE USING (true);
CREATE POLICY "Allow public delete of resources" ON resources FOR DELETE USING (true);

-- Create update policies for admin CRUD
CREATE POLICY "Allow public update of institutions" ON institutions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update of scholarships" ON scholarships FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update of opportunities" ON opportunities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update of skills" ON skills FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update of resources" ON resources FOR UPDATE USING (true) WITH CHECK (true);

-- Create Read/Write Policies for Bookmarks & Profiles (user specific)
CREATE POLICY "Allow all access to bookmarks" ON bookmarks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Create Read/Write Policies for Likes & Comments
CREATE POLICY "Allow all access to likes" ON likes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to comments" ON comments FOR ALL USING (true) WITH CHECK (true);
