import { supabase } from '../supabase';
import { institutions as mockInstitutions } from '../data/institutions';
import { scholarships as mockScholarships } from '../data/scholarships';
import { opportunities as mockOpportunities } from '../data/opportunities';
import { skills as mockSkills } from '../data/skills';
import { resources as mockResources } from '../data/resources';

// --- Helper: Map DB keys to Javascript camelCase ---
const mapInstitution = (i) => ({
  id: i.id,
  name: i.name,
  city: i.city,
  country: i.country || i.region, // Fallback for region if present
  acceptanceRate: i.acceptance_rate || i.acceptanceRate || '',
  focusPopularity: i.focus_popularity || i.focusPopularity || '',
  scholarshipDetails: i.scholarship_details || i.scholarshipDetails || '',
  ethiopianSuccess: i.ethiopian_success || i.ethiopianSuccess || '',
  rating: Number(i.rating) || 0,
  phone: i.phone,
  email: i.email,
  description: i.description,
  link: i.link
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
  // Fetch Institutions
  getInstitutions: async () => {
    try {
      const { data, error } = await supabase.from('institutions').select('*').order('name');
      if (error || !data || data.length === 0) {
        console.log('Institutions fallback to mock data');
        return mockInstitutions;
      }
      return data.map(mapInstitution);
    } catch {
      return mockInstitutions;
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
        language: data.language,
        isAdmin: data.is_admin || false
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
      is_admin: profile.isAdmin || false,
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

  // ================================================
  // Phase 3: Likes Service
  // ================================================
  getLikesCount: async (itemId, itemType) => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', String(itemId))
        .eq('item_type', String(itemType));
      if (error) return 0;
      return count || 0;
    } catch {
      return 0;
    }
  },

  checkUserLiked: async (userId, itemId, itemType) => {
    if (!userId) return false;
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', String(userId))
        .eq('item_id', String(itemId))
        .eq('item_type', String(itemType))
        .single();
      if (error) return false;
      return !!data;
    } catch {
      return false;
    }
  },

  toggleLike: async (userId, itemId, itemType) => {
    if (!userId) return { liked: false, count: 0 };
    try {
      const isLiked = await api.checkUserLiked(userId, itemId, itemType);
      if (isLiked) {
        await supabase.from('likes').delete()
          .eq('user_id', String(userId))
          .eq('item_id', String(itemId))
          .eq('item_type', String(itemType));
      } else {
        await supabase.from('likes').insert({
          user_id: String(userId),
          item_id: String(itemId),
          item_type: String(itemType)
        });
      }
      const count = await api.getLikesCount(itemId, itemType);
      return { liked: !isLiked, count };
    } catch (err) {
      console.warn('Toggle like failed:', err.message);
      return { liked: false, count: 0 };
    }
  },

  // ================================================
  // Phase 3: Comments Service
  // ================================================
  getComments: async (itemId, itemType) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('item_id', String(itemId))
        .eq('item_type', String(itemType))
        .order('created_at', { ascending: true });
      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },

  addComment: async (userId, itemId, itemType, username, firstName, content) => {
    if (!userId || !content.trim()) return null;
    try {
      const { data, error } = await supabase.from('comments').insert({
        user_id: String(userId),
        item_id: String(itemId),
        item_type: String(itemType),
        username: username || 'Anonymous',
        first_name: firstName || 'Student',
        content: content.trim()
      }).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Add comment failed:', err.message);
      return null;
    }
  },

  // ================================================
  // Phase 3: Admin CRUD Operations
  // ================================================

  // --- Institutions CRUD ---
  createInstitution: async (i) => {
    try {
      const { error } = await supabase.from('institutions').insert({
        id: i.id || `inst-${Date.now()}`,
        name: i.name,
        city: i.city,
        country: i.country,
        acceptance_rate: i.acceptanceRate,
        focus_popularity: i.focusPopularity,
        scholarship_details: i.scholarshipDetails,
        ethiopian_success: i.ethiopianSuccess,
        rating: i.rating || 0,
        phone: i.phone || null,
        email: i.email || null,
        description: i.description || null,
        link: i.link || null
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Create institution failed:', err.message);
      return false;
    }
  },

  updateInstitution: async (id, i) => {
    try {
      const { error } = await supabase.from('institutions').update({
        name: i.name,
        city: i.city,
        country: i.country,
        acceptance_rate: i.acceptanceRate,
        focus_popularity: i.focusPopularity,
        scholarship_details: i.scholarshipDetails,
        ethiopian_success: i.ethiopianSuccess,
        rating: i.rating || 0,
        phone: i.phone || null,
        email: i.email || null,
        description: i.description || null,
        link: i.link || null
      }).eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Update institution failed:', err.message);
      return false;
    }
  },

  deleteItem: async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Delete from ${table} failed:`, err.message);
      return false;
    }
  },

  // --- Scholarships CRUD ---
  createScholarship: async (d) => {
    try {
      const { error } = await supabase.from('scholarships').insert({
        id: d.id || `scholarship-${Date.now()}`,
        title: d.title, organization: d.organization, region: d.region,
        amount: d.amount, eligibility: d.eligibility, deadline: d.deadline,
        description: d.description || null, link: d.link || null,
        requirements: d.requirements || []
      });
      if (error) throw error;
      return true;
    } catch (err) { console.error('Create scholarship failed:', err.message); return false; }
  },

  // --- Opportunities CRUD ---
  createOpportunity: async (d) => {
    try {
      const { error } = await supabase.from('opportunities').insert({
        id: d.id || `opp-${Date.now()}`,
        title: d.title, category: d.category, level: d.level,
        description: d.description, deadline: d.deadline, duration: d.duration,
        link: d.link || null, required_skills: d.requiredSkills || []
      });
      if (error) throw error;
      return true;
    } catch (err) { console.error('Create opportunity failed:', err.message); return false; }
  },

  // --- Skills CRUD ---
  createSkill: async (d) => {
    try {
      const { error } = await supabase.from('skills').insert({
        id: d.id || `skill-${Date.now()}`,
        title: d.title, category: d.category, duration: d.duration,
        level: d.level, platform: d.platform, description: d.description,
        link: d.link, why_useful: d.whyUseful || null
      });
      if (error) throw error;
      return true;
    } catch (err) { console.error('Create skill failed:', err.message); return false; }
  },

  // --- Resources CRUD ---
  createResource: async (d) => {
    try {
      const { error } = await supabase.from('resources').insert({
        id: d.id || `res-${Date.now()}`,
        title: d.title, category: d.category, subject: d.subject,
        size: d.size || null, pages: d.pages || null,
        slides: d.slides || null, source: d.source || null,
        description: d.description || null, download_count: 0
      });
      if (error) throw error;
      return true;
    } catch (err) { console.error('Create resource failed:', err.message); return false; }
  },

  // ================================================
  // Phase 3: Gemini AI Tutor
  // ================================================
  askTutor: async (message, history = []) => {
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.reply || "I couldn't process that. Please try again!";
    } catch (err) {
      console.warn('Tutor API call failed, using local fallback:', err.message);
      return localTutorFallback(message);
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
      // 1. Seed Institutions
      const dbInstitutions = mockInstitutions.map(i => ({
        id: i.id,
        name: i.name,
        city: i.city,
        country: i.country,
        acceptance_rate: i.acceptanceRate,
        focus_popularity: i.focusPopularity,
        scholarship_details: i.scholarshipDetails,
        ethiopian_success: i.ethiopianSuccess,
        rating: i.rating || 0,
        phone: i.phone || null,
        email: i.email || null,
        description: i.description || null,
        link: i.link || null
      }));
      // Clear current to prevent duplicates, then insert
      await supabase.from('institutions').delete().neq('id', 'placeholder');
      const { error: schErr } = await supabase.from('institutions').insert(dbInstitutions);
      if (schErr) results.errors.push(`Institutions: ${schErr.message}`);
      else results.schools = dbInstitutions.length;

      // 2. Seed Scholarships
      const dbScholarships = mockScholarships.map(s => ({
        id: s.id,
        title: s.title,
        organization: s.organization,
        region: s.region,
        amount: s.amount,
        eligibility: s.eligibility,
        deadline: s.deadline,
        description: s.description || null,
        link: s.link || null,
        requirements: s.requirements || []
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
        link: o.link || null,
        required_skills: o.requiredSkills || [],
        posted_date: o.postedDate || null
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
        why_useful: s.whyUseful || null
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
        size: r.size || null,
        pages: r.pages || null,
        slides: r.slides || null,
        source: r.source || null,
        description: r.description || null,
        download_count: r.downloadCount || 0
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

// --- Local AI Fallback (used when the serverless proxy is unavailable) ---
function localTutorFallback(userText) {
  const txt = userText.toLowerCase();
  if (txt.includes('hello') || txt.includes('hi ') || txt.includes('hey')) {
    return "Hello! Hope your studies are going wonderfully today. How can I assist your educational journey in Ethiopia? 🇪🇹";
  } else if (txt.includes('ielts') || txt.includes('toefl') || txt.includes('english') || txt.includes('det')) {
    return "Preparing for English assessments? We offer comprehensive study guides for IELTS, TOEFL, and Duolingo English Tests (DET) under the 'Tests' tab. Make sure to try our interactive quiz engine! 📝";
  } else if (txt.includes('scholarship') || txt.includes('funding') || txt.includes('mastercard')) {
    return "The Mastercard Foundation Scholars Program at AAU is highly recommended. It offers full tuition, stipends, and housing. Deadlines are usually in late August. Check our 'Scholarships' tab for more details! 💰";
  } else if (txt.includes('school') || txt.includes('university') || txt.includes('academy')) {
    return "We have detailed listings for 20+ top institutions like Sandford Academy, Ethio-Japan School, and AAU. Go to the 'Schools' tab and filter by region or curriculum (IB, National, Cambridge). 🏫";
  } else if (txt.includes('physics') || txt.includes('math') || txt.includes('biology') || txt.includes('study')) {
    return "Need study materials? Head over to our 'Resources' library to instantly preview or download Calculus slides, Cell Mitosis presentations, and Physics equation sheets! 📚";
  } else if (txt.includes('skill') || txt.includes('course') || txt.includes('learn') || txt.includes('python') || txt.includes('code')) {
    return "Want to build new skills? Check the 'Skills' tab for 30+ free courses on Python, Web Development, Data Science, and more from platforms like Coursera and Khan Academy! 💡";
  }
  return "That's an interesting topic! While I'm currently in offline mode, you can explore our dedicated tabs — 'Schools' for institution data, 'Scholarships' for funding, 'Tests' for exam prep, and 'Resources' for study materials. I'll be fully powered by AI soon! 🚀";
}
