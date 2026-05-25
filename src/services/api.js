import { supabase } from '../supabase';
import { schools as mockSchools } from '../data/schools';
import { scholarships as mockScholarships } from '../data/scholarships';
import { opportunities as mockOpportunities } from '../data/opportunities';
import { skills as mockSkills } from '../data/skills';
import { resources as mockResources } from '../data/resources';

// --- Helper: Map DB keys to Javascript camelCase ---
const mapSchool = (s) => ({
  id: s.id,
  name: s.name,
  city: s.city,
  region: s.region,
  curriculum: s.curriculum,
  rating: Number(s.rating) || 0,
  established: s.established,
  studentCount: s.student_count,
  phone: s.phone,
  email: s.email,
  description: s.description
});

const mapScholarship = (s) => ({
  id: s.id,
  title: s.title,
  organization: s.organization,
  region: s.region,
  amount: s.amount,
  eligibility: s.eligibility,
  deadline: s.deadline,
  description: s.description,
  link: s.link,
  requirements: s.requirements || []
});

const mapOpportunity = (o) => ({
  id: o.id,
  title: o.title,
  category: o.category,
  level: o.level,
  description: o.description,
  deadline: o.deadline,
  duration: o.duration,
  link: o.link,
  requiredSkills: o.required_skills || [],
  postedDate: o.posted_date
});

const mapSkill = (s) => ({
  id: s.id,
  title: s.title,
  category: s.category,
  duration: s.duration,
  level: s.level,
  platform: s.platform,
  description: s.description,
  link: s.link,
  whyUseful: s.why_useful
});

const mapResource = (r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  subject: r.subject,
  size: r.size,
  pages: r.pages,
  slides: r.slides,
  source: r.source,
  description: r.description,
  downloadCount: r.download_count || 0
});

// --- API Layer ---
export const api = {
  // Fetch Schools
  getSchools: async () => {
    try {
      const { data, error } = await supabase.from('schools').select('*').order('name');
      if (error || !data || data.length === 0) {
        console.log('Schools fallback to mock data');
        return mockSchools;
      }
      return data.map(mapSchool);
    } catch {
      return mockSchools;
    }
  },

  // Fetch Scholarships
  getScholarships: async () => {
    try {
      const { data, error } = await supabase.from('scholarships').select('*').order('deadline');
      if (error || !data || data.length === 0) {
        console.log('Scholarships fallback to mock data');
        return mockScholarships;
      }
      return data.map(mapScholarship);
    } catch {
      return mockScholarships;
    }
  },

  // Fetch Opportunities
  getOpportunities: async () => {
    try {
      const { data, error } = await supabase.from('opportunities').select('*').order('deadline');
      if (error || !data || data.length === 0) {
        console.log('Opportunities fallback to mock data');
        return mockOpportunities;
      }
      return data.map(mapOpportunity);
    } catch {
      return mockOpportunities;
    }
  },

  // Fetch Skills
  getSkills: async () => {
    try {
      const { data, error } = await supabase.from('skills').select('*').order('title');
      if (error || !data || data.length === 0) {
        console.log('Skills fallback to mock data');
        return mockSkills;
      }
      return data.map(mapSkill);
    } catch {
      return mockSkills;
    }
  },

  // Fetch Resources
  getResources: async () => {
    try {
      const { data, error } = await supabase.from('resources').select('*').order('title');
      if (error || !data || data.length === 0) {
        console.log('Resources fallback to mock data');
        return mockResources;
      }
      return data.map(mapResource);
    } catch {
      return mockResources;
    }
  },

  // --- Bookmarks Service ---
  getBookmarks: async (userId) => {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', String(userId));
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Failed to fetch bookmarks:', err.message);
      // Fallback: localStorage
      const local = localStorage.getItem(`bookmarks_${userId}`);
      return local ? JSON.parse(local) : [];
    }
  },

  addBookmark: async (userId, itemId, itemType, itemTitle) => {
    if (!userId) return false;
    const bookmarkData = {
      user_id: String(userId),
      item_id: String(itemId),
      item_type: String(itemType),
      item_title: String(itemTitle)
    };
    try {
      const { error } = await supabase.from('bookmarks').insert(bookmarkData);
      if (error) throw error;
      
      // Update local storage too for redundancy
      const current = await api.getBookmarks(userId);
      if (!current.some(b => b.item_id === itemId && b.item_type === itemType)) {
        const updated = [...current, { ...bookmarkData, id: Date.now() }];
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.warn('Failed to save bookmark in DB, saving locally:', err.message);
      const current = localStorage.getItem(`bookmarks_${userId}`) 
        ? JSON.parse(localStorage.getItem(`bookmarks_${userId}`)) 
        : [];
      if (!current.some(b => b.item_id === itemId && b.item_type === itemType)) {
        const updated = [...current, { ...bookmarkData, id: Date.now() }];
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      }
      return true;
    }
  },

  removeBookmark: async (userId, itemId, itemType) => {
    if (!userId) return false;
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', String(userId))
        .eq('item_id', String(itemId))
        .eq('item_type', String(itemType));
      if (error) throw error;

      // Update local storage
      const local = localStorage.getItem(`bookmarks_${userId}`);
      if (local) {
        const updated = JSON.parse(local).filter(b => !(b.item_id === itemId && b.item_type === itemType));
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.warn('Failed to delete bookmark in DB, removing locally:', err.message);
      const local = localStorage.getItem(`bookmarks_${userId}`);
      if (local) {
        const updated = JSON.parse(local).filter(b => !(b.item_id === itemId && b.item_type === itemType));
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updated));
      }
      return true;
    }
  },

  // --- Profile Settings ---
  getProfile: async (userId, defaultProfile = {}) => {
    if (!userId) return defaultProfile;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', String(userId))
        .single();
      if (error || !data) return defaultProfile;
      return {
        userId: data.user_id,
        username: data.username,
        firstName: data.first_name,
        gradeLevel: data.grade_level,
        preferredSubjects: data.preferred_subjects || [],
        language: data.language
      };
    } catch {
      const local = localStorage.getItem(`profile_${userId}`);
      return local ? JSON.parse(local) : defaultProfile;
    }
  },

  saveProfile: async (userId, profile) => {
    if (!userId) return false;
    const dbProfile = {
      user_id: String(userId),
      username: profile.username || '',
      first_name: profile.firstName || '',
      grade_level: profile.gradeLevel || 'all',
      preferred_subjects: profile.preferredSubjects || [],
      language: profile.language || 'en',
      updated_at: new Date().toISOString()
    };
    try {
      const { error } = await supabase.from('profiles').upsert(dbProfile);
      if (error) throw error;

      // Store in localStorage for backup
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
      return true;
    } catch (err) {
      console.warn('Failed to upsert profile in DB, saving locally:', err.message);
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
      return true;
    }
  },

  // --- Seeder Tools ---
  seedDatabase: async () => {
    console.log('Starting Supabase Seeding Operations...');
    const results = {
      schools: 0,
      scholarships: 0,
      opportunities: 0,
      skills: 0,
      resources: 0,
      errors: []
    };

    try {
      // 1. Seed Schools
      const dbSchools = mockSchools.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        region: s.region,
        curriculum: s.curriculum,
        rating: s.rating,
        established: s.established,
        student_count: s.studentCount,
        phone: s.phone,
        email: s.email,
        description: s.description
      }));
      // Clear current to prevent duplicates, then insert
      await supabase.from('schools').delete().neq('id', 'placeholder');
      const { error: schErr } = await supabase.from('schools').insert(dbSchools);
      if (schErr) results.errors.push(`Schools: ${schErr.message}`);
      else results.schools = dbSchools.length;

      // 2. Seed Scholarships
      const dbScholarships = mockScholarships.map(s => ({
        id: s.id,
        title: s.title,
        organization: s.organization,
        region: s.region,
        amount: s.amount,
        eligibility: s.eligibility,
        deadline: s.deadline,
        description: s.description,
        link: s.link,
        requirements: s.requirements
      }));
      await supabase.from('scholarships').delete().neq('id', 'placeholder');
      const { error: scholErr } = await supabase.from('scholarships').insert(dbScholarships);
      if (scholErr) results.errors.push(`Scholarships: ${scholErr.message}`);
      else results.scholarships = dbScholarships.length;

      // 3. Seed Opportunities
      const dbOpportunities = mockOpportunities.map(o => ({
        id: o.id,
        title: o.title,
        category: o.category,
        level: o.level,
        description: o.description,
        deadline: o.deadline,
        duration: o.duration,
        link: o.link,
        required_skills: o.requiredSkills,
        posted_date: o.postedDate
      }));
      await supabase.from('opportunities').delete().neq('id', 'placeholder');
      const { error: oppErr } = await supabase.from('opportunities').insert(dbOpportunities);
      if (oppErr) results.errors.push(`Opportunities: ${oppErr.message}`);
      else results.opportunities = dbOpportunities.length;

      // 4. Seed Skills
      const dbSkills = mockSkills.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        duration: s.duration,
        level: s.level,
        platform: s.platform,
        description: s.description,
        link: s.link,
        why_useful: s.whyUseful
      }));
      await supabase.from('skills').delete().neq('id', 'placeholder');
      const { error: skillErr } = await supabase.from('skills').insert(dbSkills);
      if (skillErr) results.errors.push(`Skills: ${skillErr.message}`);
      else results.skills = dbSkills.length;

      // 5. Seed Resources
      const dbResources = mockResources.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        subject: r.subject,
        size: r.size,
        pages: r.pages,
        slides: r.slides,
        source: r.source,
        description: r.description,
        download_count: r.downloadCount
      }));
      await supabase.from('resources').delete().neq('id', 'placeholder');
      const { error: resErr } = await supabase.from('resources').insert(dbResources);
      if (resErr) results.errors.push(`Resources: ${resErr.message}`);
      else results.resources = dbResources.length;

      console.log('Seeding finished:', results);
      return results;
    } catch (err) {
      console.error('Critical seeder crash:', err);
      results.errors.push(`Critical: ${err.message}`);
      return results;
    }
  }
};
