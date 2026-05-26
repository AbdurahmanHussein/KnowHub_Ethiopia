import { useState, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, GraduationCap, Compass, Lightbulb, 
  FileText, MessageSquare, BarChart2, Settings, Heart, 
  Search, Moon, Sun, ChevronRight, MapPin, Calendar, 
  Phone, Mail, X, Check, ArrowRight, Play, RefreshCw, 
  Send, Award, Award as Trophy, BookMarked, User, Globe,
  Shield, Plus, Trash2, Edit3, ThumbsUp, MessageCircle,
  LogIn, LogOut, UserPlus, Eye, EyeOff, Loader, Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { auth } from '../supabase';

const quizQuestions = {
  ielts: [
    {
      q: "In IELTS Listening, how many sections are there in total?",
      options: ["2 Sections", "3 Sections", "4 Sections", "5 Sections"],
      answer: 2,
      explanation: "The IELTS Listening test has 4 sections with 10 questions each, making a total of 40 questions."
    },
    {
      q: "What is the recommended minimum word count for IELTS Writing Task 2?",
      options: ["150 words", "200 words", "250 words", "300 words"],
      answer: 2,
      explanation: "Writing Task 2 requires a minimum of 250 words and counts for two-thirds of your overall writing score."
    },
    {
      q: "Which skill is NOT tested directly in the IELTS Speaking exam?",
      options: ["Pronunciation", "Spelling", "Lexical Resource", "Grammatical Accuracy"],
      answer: 1,
      explanation: "Speaking evaluates fluency, pronunciation, grammar, and vocabulary. Spelling is evaluated in Listening and Writing."
    }
  ],
  toefl: [
    {
      q: "What is the maximum possible score on the TOEFL iBT exam?",
      options: ["9.0 points", "100 points", "120 points", "160 points"],
      answer: 2,
      explanation: "Each of the four sections (Reading, Listening, Speaking, Writing) is scored from 0-30, totaling 120 points."
    },
    {
      q: "How are the speaking responses recorded in the TOEFL iBT?",
      options: ["Interview with live examiner", "Speaking into a microphone/computer", "Written transcript of spoken audio", "None of the above"],
      answer: 1,
      explanation: "TOEFL Speaking is fully automated/computer-delivered; you speak into a microphone, and your answers are evaluated by AI and human markers."
    }
  ],
  det: [
    {
      q: "What is the general registration cost of the Duolingo English Test (DET)?",
      options: ["$49 USD", "$100 USD", "$150 USD", "$220 USD"],
      answer: 0,
      explanation: "The DET is exceptionally affordable at only $49 USD, compared to other exams costing over $200 USD."
    },
    {
      q: "Where do students take the Duolingo English Test?",
      options: ["At a certified testing center", "At any quiet room with a computer and camera", "Through a Telegram bot script", "At local embassies"],
      answer: 1,
      explanation: "The DET is taken online, at home, requiring only a stable computer, internet, front camera, and microphone."
    }
  ]
};

export default function Dashboard({ isTelegram, user: tgUser, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Handle bot deep-linking / tab query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const validTabs = ['home', 'schools', 'scholarships', 'opportunities', 'skills', 'testprep', 'resources', 'aitutor', 'progress', 'settings', 'admin'];
    if (tabParam && validTabs.includes(tabParam.toLowerCase())) {
      setActiveTab(tabParam.toLowerCase());
    }
  }, []);
  
  // Auth State
  const [authUser, setAuthUser] = useState(null); // Supabase auth user (browser)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data States
  const [schools, setSchools] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [scholarshipFilter, setScholarshipFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');

  // Detail Modals
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Settings & Profile
  const [profile, setProfile] = useState({
    gradeLevel: 'all',
    preferredSubjects: [],
    language: 'en',
    isAdmin: false
  });
  const [userId, setUserId] = useState(() => tgUser?.id || 'guest-user');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seederStatus, setSeederStatus] = useState(null);

  // Quiz States
  const [quizTest, setQuizTest] = useState('ielts');
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizScore, setQuizScore] = useState(null);

  // AI Chat States
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState([
    { role: 'bot', text: "Hello! I'm your KnowHub AI Study Assistant, powered by Google Gemini. Ask me anything about Ethiopian universities, scholarships, study habits, or standardized exam preparation! 🎓" }
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Likes & Comments State
  const [modalLikes, setModalLikes] = useState({ count: 0, liked: false });
  const [modalComments, setModalComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Admin State
  const [adminItemType, setAdminItemType] = useState('schools');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({});
  const [adminSaving, setAdminSaving] = useState(false);

  // --- Auth: Check existing session on mount ---
  useEffect(() => {
    if (!isTelegram) {
      auth.getSession().then(({ session }) => {
        if (session?.user) {
          setAuthUser(session.user);
          setUserId(session.user.id);
        }
      });
      const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          setUserId(session.user.id);
        } else {
          setAuthUser(null);
        }
      });
      return () => subscription?.unsubscribe();
    }
  }, [isTelegram]);

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const uId = tgUser?.id || authUser?.id || 'guest-user';
        setUserId(uId);
        
        const [schs, schols, opps, sks, res, bms, prof] = await Promise.all([
          api.getSchools(),
          api.getScholarships(),
          api.getOpportunities(),
          api.getSkills(),
          api.getResources(),
          api.getBookmarks(uId),
          api.getProfile(uId, {
            username: tgUser?.username || authUser?.email || 'Guest',
            firstName: tgUser?.first_name || authUser?.user_metadata?.name || 'Guest Student',
            gradeLevel: 'all',
            preferredSubjects: [],
            language: 'en',
            isAdmin: false
          })
        ]);

        setSchools(schs);
        setScholarships(schols);
        setOpportunities(opps);
        setSkills(sks);
        setResources(res);
        setBookmarks(bms);
        setProfile(prof);
      } catch (err) {
        console.error('Error loading API data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tgUser, authUser]);

  // Handle Theme Application
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--color-light', '#121212');
      root.style.setProperty('--color-dark', '#F8F6F1');
      root.style.setProperty('--color-card', '#1E1E1E');
      root.style.setProperty('--color-surface', '#242424');
      root.style.setProperty('--color-border', '#333333');
    } else {
      root.style.setProperty('--color-light', '#F8F6F1');
      root.style.setProperty('--color-dark', '#1A1A1A');
      root.style.setProperty('--color-card', '#FFFFFF');
      root.style.setProperty('--color-surface', '#FDF9F3');
      root.style.setProperty('--color-border', '#E8DCC8');
    }
  }, [theme]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat, aiTyping]);

  // Load likes/comments when a modal opens
  useEffect(() => {
    if (selectedSchool) {
      loadModalSocial(selectedSchool.id, 'school');
    } else if (selectedScholarship) {
      loadModalSocial(selectedScholarship.id, 'scholarship');
    }
  }, [selectedSchool, selectedScholarship]);

  const loadModalSocial = async (itemId, itemType) => {
    setLoadingComments(true);
    const [count, liked, comments] = await Promise.all([
      api.getLikesCount(itemId, itemType),
      api.checkUserLiked(userId, itemId, itemType),
      api.getComments(itemId, itemType)
    ]);
    setModalLikes({ count, liked });
    setModalComments(comments);
    setLoadingComments(false);
  };

  // Theme Toggler
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- Auth Handlers ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { data, error } = await auth.signUp(authEmail, authPassword, { name: authName });
        if (error) throw error;
        if (data?.user) {
          setAuthUser(data.user);
          setUserId(data.user.id);
          // Create profile
          await api.saveProfile(data.user.id, {
            username: authEmail,
            firstName: authName || 'Student',
            gradeLevel: 'all',
            preferredSubjects: [],
            language: 'en',
            isAdmin: false
          });
          setShowAuthModal(false);
        }
      } else {
        const { data, error } = await auth.signIn(authEmail, authPassword);
        if (error) throw error;
        if (data?.user) {
          setAuthUser(data.user);
          setUserId(data.user.id);
          setShowAuthModal(false);
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setAuthUser(null);
    setUserId('guest-user');
    setProfile(prev => ({ ...prev, isAdmin: false }));
  };

  // Bookmarks Toggle Helper
  const isBookmarked = (itemId, itemType) => {
    return bookmarks.some(b => b.item_id === String(itemId) && b.item_type === itemType);
  };

  const handleToggleBookmark = async (item, itemType) => {
    const isBook = isBookmarked(item.id, itemType);
    const title = item.name || item.title || 'Untitled';
    if (isBook) {
      const ok = await api.removeBookmark(userId, item.id, itemType);
      if (ok) {
        setBookmarks(prev => prev.filter(b => !(b.item_id === String(item.id) && b.item_type === itemType)));
      }
    } else {
      const ok = await api.addBookmark(userId, item.id, itemType, title);
      if (ok) {
        setBookmarks(prev => [...prev, { user_id: userId, item_id: String(item.id), item_type: itemType, item_title: title }]);
      }
    }
  };

  // Like Toggle
  const handleToggleLike = async (itemId, itemType) => {
    const result = await api.toggleLike(userId, itemId, itemType);
    setModalLikes({ count: result.count, liked: result.liked });
  };

  // Add Comment
  const handleAddComment = async (itemId, itemType) => {
    if (!newComment.trim()) return;
    const comment = await api.addComment(
      userId, itemId, itemType,
      profile.username || 'Anonymous',
      profile.firstName || 'Student',
      newComment
    );
    if (comment) {
      setModalComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  // Profile Save
  const handleSaveProfile = async (updates) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await api.saveProfile(userId, newProfile);
  };

  // Seeder Trigger
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeederStatus(null);
    try {
      const res = await api.seedDatabase();
      setSeederStatus(res);
      const [schs, schols, opps, sks, resourcesData] = await Promise.all([
        api.getSchools(),
        api.getScholarships(),
        api.getOpportunities(),
        api.getSkills(),
        api.getResources()
      ]);
      setSchools(schs);
      setScholarships(schols);
      setOpportunities(opps);
      setSkills(sks);
      setResources(resourcesData);
    } catch (err) {
      setSeederStatus({ errors: [err.message] });
    } finally {
      setIsSeeding(false);
    }
  };

  // Quiz Engine Helpers
  const startQuiz = (testId) => {
    setQuizTest(testId);
    setQuizActive(true);
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizScore(null);
  };

  const handleQuizAnswer = (optionIdx) => {
    const updated = [...quizAnswers, optionIdx];
    setQuizAnswers(updated);
    if (quizIndex + 1 < quizQuestions[quizTest].length) {
      setQuizIndex(prev => prev + 1);
    } else {
      let correct = 0;
      quizQuestions[quizTest].forEach((q, idx) => {
        if (updated[idx] === q.answer) correct++;
      });
      setQuizScore({
        correct,
        total: quizQuestions[quizTest].length,
        percent: Math.round((correct / quizQuestions[quizTest].length) * 100)
      });
    }
  };

  // AI Chat — now connected to Gemini via /api/tutor
  const triggerAiResponse = async (userText) => {
    const updatedChat = [...aiChat, { role: 'user', text: userText }];
    setAiChat(updatedChat);
    setAiMessage('');
    setAiTyping(true);

    try {
      const reply = await api.askTutor(userText, updatedChat.slice(-8));
      setAiChat([...updatedChat, { role: 'bot', text: reply }]);
    } catch {
      setAiChat([...updatedChat, { role: 'bot', text: "Sorry, I couldn't process that. Please try again!" }]);
    } finally {
      setAiTyping(false);
    }
  };

  // Admin CRUD Handlers
  const handleAdminCreate = async () => {
    setAdminSaving(true);
    let success = false;
    if (adminItemType === 'schools') success = await api.createSchool(adminForm);
    else if (adminItemType === 'scholarships') success = await api.createScholarship(adminForm);
    else if (adminItemType === 'opportunities') success = await api.createOpportunity(adminForm);
    else if (adminItemType === 'skills') success = await api.createSkill(adminForm);
    else if (adminItemType === 'resources') success = await api.createResource(adminForm);

    if (success) {
      // Reload data
      const fresh = adminItemType === 'schools' ? await api.getSchools()
        : adminItemType === 'scholarships' ? await api.getScholarships()
        : adminItemType === 'opportunities' ? await api.getOpportunities()
        : adminItemType === 'skills' ? await api.getSkills()
        : await api.getResources();
      
      if (adminItemType === 'schools') setSchools(fresh);
      else if (adminItemType === 'scholarships') setScholarships(fresh);
      else if (adminItemType === 'opportunities') setOpportunities(fresh);
      else if (adminItemType === 'skills') setSkills(fresh);
      else setResources(fresh);

      setShowAdminForm(false);
      setAdminForm({});
    }
    setAdminSaving(false);
  };

  const handleAdminDelete = async (table, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const ok = await api.deleteItem(table, id);
    if (ok) {
      if (table === 'schools') setSchools(prev => prev.filter(s => s.id !== id));
      else if (table === 'scholarships') setScholarships(prev => prev.filter(s => s.id !== id));
      else if (table === 'opportunities') setOpportunities(prev => prev.filter(s => s.id !== id));
      else if (table === 'skills') setSkills(prev => prev.filter(s => s.id !== id));
      else if (table === 'resources') setResources(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Social Panel Component (Likes & Comments) ---
  const renderSocialPanel = (itemId, itemType) => (
    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 24, paddingTop: 20 }}>
      {/* Like Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button 
          onClick={() => handleToggleLike(itemId, itemType)}
          className={modalLikes.liked ? 'like-btn-active' : ''}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: modalLikes.liked ? 'rgba(212,103,46,0.1)' : 'var(--color-light)',
            border: `1.5px solid ${modalLikes.liked ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '10px 20px',
            color: modalLikes.liked ? 'var(--color-primary)' : 'var(--color-muted)',
            fontWeight: 700, fontSize: 13,
            transition: 'all 0.3s'
          }}
        >
          <ThumbsUp size={16} fill={modalLikes.liked ? 'var(--color-primary)' : 'none'} />
          {modalLikes.count} {modalLikes.count === 1 ? 'Like' : 'Likes'}
        </button>
        <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MessageCircle size={14} /> {modalComments.length} Comments
        </span>
      </div>

      {/* Comments List */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Discussion
        </h4>
        {loadingComments ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Loader size={20} className="animate-rotate" color="var(--color-primary)" />
          </div>
        ) : modalComments.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto' }}>
            {modalComments.map((c, idx) => (
              <div key={c.id || idx} className="comment-bubble" style={{
                background: 'var(--color-light)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-primary)' }}>
                    {c.first_name || 'Student'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-dark)', margin: 0, lineHeight: 1.5 }}>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleAddComment(itemId, itemType); }} style={{
        display: 'flex', gap: 10,
        background: 'var(--color-light)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 8
      }}>
        <input
          placeholder="Share your thoughts or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            color: 'var(--color-dark)', fontSize: 13,
            paddingLeft: 10, fontFamily: 'var(--font-body)', outline: 'none'
          }}
        />
        <button type="submit" style={{
          background: 'var(--color-primary)', color: '#fff',
          borderRadius: 8, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );

  // --- RENDERING TABS ---

  // 1. Home Tab
  const renderHome = () => {
    const featuredSchools = schools.slice(0, 3);
    const activeStreak = 14;
    const hoursStudied = 8.5;

    return (
      <div className="animate-fade-in" style={{ padding: '0 0 40px' }}>
        {/* Rich Hero Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary-dark) 100%)',
          color: '#fff',
          padding: '40px 24px',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 32
        }}>
          <div style={{
            position: 'absolute',
            width: 250, height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(214, 103, 46, 0.25) 0%, transparent 70%)',
            top: '-20%', right: '-10%'
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12, fontWeight: 600,
              color: 'var(--color-accent-light)',
              marginBottom: 16
            }}>
              {authUser ? '🔑 Authenticated' : isTelegram ? '📱 Telegram Mini App' : '💡 Student Hub Dashboard'}
            </span>
            <h1 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: 8, lineHeight: 1.2
            }}>
              Welcome Back, {profile.firstName || 'Student'}!
            </h1>
            <p style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: 480, lineHeight: 1.5
            }}>
              Explore real-time resources, review your standardized test goals, and continue your journey toward excellence.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <div className="glass-card" style={{
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Search size={20} color="var(--color-primary)" />
            <input 
              placeholder="Search schools, scholarships, study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none', background: 'transparent',
                color: 'var(--color-dark)', fontSize: 15,
                width: '100%', fontFamily: 'var(--font-body)', outline: 'none'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', color: 'var(--color-muted)' }}>
                <X size={18} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginTop: 8, padding: 16,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h4 style={{ fontSize: 13, color: 'var(--color-primary)', marginBottom: 8, fontWeight: 700 }}>
                Live Search Results
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {schools.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(s => (
                  <div key={s.id} onClick={() => { setSelectedSchool(s); setSearchQuery(''); }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>🏫 {s.name}</span>
                    <span style={{ color: 'var(--color-muted)' }}>{s.city}</span>
                  </div>
                ))}
                {scholarships.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(s => (
                  <div key={s.id} onClick={() => { setSelectedScholarship(s); setSearchQuery(''); }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>💰 {s.title}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{s.amount}</span>
                  </div>
                ))}
                {skills.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(s => (
                  <div key={s.id} onClick={() => { setActiveTab('skills'); setSearchQuery(''); }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>💡 {s.title}</span>
                    <span style={{ color: 'var(--color-success)' }}>{s.platform}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlighted Stats Grid */}
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🔥', label: 'Daily Streak', value: `${activeStreak} Days`, color: 'var(--color-primary)' },
              { emoji: '⏱️', label: 'Hours Studied', value: `${hoursStudied}h`, color: 'var(--color-secondary)' },
              { emoji: '💖', label: 'Bookmarks', value: `${bookmarks.length} Items`, color: 'var(--color-accent)' }
            ].map(stat => (
              <div key={stat.label} className="hover-lift" style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 20, textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{stat.emoji}</span>
                <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block' }}>{stat.label}</span>
                <strong style={{ fontSize: 20, color: stat.color }}>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Section Grid */}
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Explore Programs</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { id: 'schools', title: 'Discover Schools', desc: 'Browse 20+ top high schools and public universities inside Ethiopia.', icon: <GraduationCap size={24} color="#fff" />, color: 'var(--color-primary)' },
              { id: 'scholarships', title: 'Scholarships', desc: 'Unlock active funding programs tailored for East African students.', icon: <Compass size={24} color="#fff" />, color: 'var(--color-secondary)' },
              { id: 'testprep', title: 'Language Tests', desc: 'Full instructions and practice quizzes for IELTS, TOEFL, and DET.', icon: <Award size={24} color="#fff" />, color: 'var(--color-success)' },
              { id: 'aitutor', title: 'AI Study Assistant', desc: 'Chat with Gemini-powered virtual tutor for educational answers.', icon: <Sparkles size={24} color="#fff" />, color: 'var(--color-accent)' },
            ].map(f => (
              <div 
                key={f.id} 
                onClick={() => setActiveTab(f.id)}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 24, cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                className="hover-lift"
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4 }}>{f.desc}</p>
                <ChevronRight size={18} style={{ position: 'absolute', bottom: 20, right: 20, color: 'var(--color-primary)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Featured Educational Focus */}
        <div style={{ padding: '0 24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-accent) 15%, var(--color-primary) 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--color-secondary)' }}>
                Featured Guideline
              </span>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>Master IELTS in 12 Weeks</h3>
              <p style={{ fontSize: 14, opacity: 0.9, marginTop: 8, lineHeight: 1.5 }}>
                Achieve a band score of 7.5+ with structured lessons on listening, reading layouts, essay mapping, and speaking tools.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('testprep')}
              style={{
                alignSelf: 'flex-start',
                background: 'var(--color-secondary)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.3s'
              }}
            >
              Start Prep Course <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 2. Schools Tab
  const renderSchools = () => {
    const filtered = schools.filter(s => {
      if (schoolFilter !== 'all' && s.curriculum.toLowerCase() !== schoolFilter.toLowerCase()) return false;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Discover Schools</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Browse 20+ verified primary, secondary, and higher institutions in Ethiopia.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
          {['all', 'Ethiopian National', 'IB', 'IB / Cambridge', 'French Baccalaureate'].map(cur => (
            <button
              key={cur}
              onClick={() => setSchoolFilter(cur)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: schoolFilter === cur ? 'var(--color-primary)' : 'var(--color-card)',
                color: schoolFilter === cur ? '#fff' : 'var(--color-dark)',
                border: '1px solid var(--color-border)',
                fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap', transition: 'all 0.3s'
              }}
            >
              {cur === 'all' ? '🏫 All Curriculums' : cur}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <div 
              key={s.id}
              className="hover-lift"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24, position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button 
                onClick={() => handleToggleBookmark(s, 'school')}
                style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'none',
                  color: isBookmarked(s.id, 'school') ? 'var(--color-primary)' : 'var(--color-muted)'
                }}
              >
                <Heart size={20} fill={isBookmarked(s.id, 'school') ? 'var(--color-primary)' : 'none'} />
              </button>
              <span style={{
                background: 'var(--color-primary-light)15',
                color: 'var(--color-primary-dark)',
                padding: '4px 8px', borderRadius: 4,
                fontSize: 10, fontWeight: 700,
                display: 'inline-block', marginBottom: 12
              }}>
                {s.curriculum}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, paddingRight: 24 }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <MapPin size={14} color="var(--color-primary)" /> {s.city}, {s.region}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Est. {s.established}</span>
                <button 
                  onClick={() => setSelectedSchool(s)}
                  style={{
                    background: 'var(--color-secondary)',
                    color: '#fff', borderRadius: 6,
                    padding: '8px 16px', fontSize: 12, fontWeight: 600
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Scholarships Tab
  const renderScholarships = () => {
    const filtered = scholarships.filter(s => {
      if (scholarshipFilter !== 'all' && s.region.toLowerCase() !== scholarshipFilter.toLowerCase()) return false;
      return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             s.organization.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Scholarships & Funding</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Find fully-funded and partial scholarship grants open to Ethiopian high school and college students.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
          {['all', 'Ethiopia', 'East Africa', 'Pan-Africa', 'Global'].map(reg => (
            <button
              key={reg}
              onClick={() => setScholarshipFilter(reg)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: scholarshipFilter === reg ? 'var(--color-secondary)' : 'var(--color-card)',
                color: scholarshipFilter === reg ? '#fff' : 'var(--color-dark)',
                border: '1px solid var(--color-border)',
                fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap', transition: 'all 0.3s'
              }}
            >
              {reg === 'all' ? '🌍 All Regions' : reg}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <div 
              key={s.id}
              className="hover-lift"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24, position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <button 
                  onClick={() => handleToggleBookmark(s, 'scholarship')}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'none',
                    color: isBookmarked(s.id, 'scholarship') ? 'var(--color-primary)' : 'var(--color-muted)'
                  }}
                >
                  <Heart size={20} fill={isBookmarked(s.id, 'scholarship') ? 'var(--color-primary)' : 'none'} />
                </button>
                <span style={{
                  background: 'var(--color-success)15',
                  color: 'var(--color-success)',
                  padding: '4px 8px', borderRadius: 4,
                  fontSize: 10, fontWeight: 700,
                  display: 'inline-block', marginBottom: 12
                }}>
                  {s.amount}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, paddingRight: 24 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>{s.organization} • {s.region}</p>
                <p style={{ fontSize: 13, color: 'var(--color-dark)', opacity: 0.8, lineHeight: 1.4, marginBottom: 20 }}>
                  {s.description.slice(0, 110)}...
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} /> Deadline: {s.deadline}
                </span>
                <button 
                  onClick={() => setSelectedScholarship(s)}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff', borderRadius: 6,
                    padding: '8px 16px', fontSize: 12, fontWeight: 600
                  }}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 4. Opportunities Tab
  const renderOpportunities = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Extracurricular Opportunities</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Browse STEM bootcamps, student internships, national Olympiads, and leadership development camps.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {opportunities.map(o => (
            <div 
              key={o.id}
              className="hover-lift"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24, boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{
                  background: 'var(--color-accent)15',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 8px', borderRadius: 4,
                  fontSize: 10, fontWeight: 700
                }}>
                  {o.category}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Duration: {o.duration}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{o.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4, marginBottom: 16 }}>{o.description}</p>
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {o.requiredSkills.map(sk => (
                    <span key={sk} style={{ fontSize: 10, background: 'var(--color-light)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Deadline: {o.deadline}</span>
                  <a href={o.link} target="_blank" rel="noopener noreferrer" style={{
                    color: 'var(--color-primary)',
                    fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    Apply Externally <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 5. Skills Tab
  const renderSkills = () => {
    const filtered = skills.filter(s => {
      if (skillFilter !== 'all' && s.category.toLowerCase() !== skillFilter.toLowerCase()) return false;
      return true;
    });

    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Learn New Skills</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Access top-quality free courses that are accessible in Ethiopia without restrictions.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
          {['all', 'Tech', 'Design', 'Business', 'Language', 'Science', 'Writing'].map(cat => (
            <button
              key={cat}
              onClick={() => setSkillFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: skillFilter === cat ? 'var(--color-primary)' : 'var(--color-card)',
                color: skillFilter === cat ? '#fff' : 'var(--color-dark)',
                border: '1px solid var(--color-border)',
                fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap', transition: 'all 0.3s'
              }}
            >
              {cat === 'all' ? '💡 All Categories' : cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <div 
              key={s.id}
              className="hover-lift"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24, boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, background: 'var(--color-secondary)15', color: 'var(--color-secondary)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    {s.platform}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{s.duration}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.4, marginBottom: 14 }}>{s.description}</p>
                <div style={{ background: 'var(--color-light)', padding: 12, borderRadius: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: 2 }}>
                    Why study this?
                  </span>
                  <p style={{ fontSize: 12, color: 'var(--color-dark)', margin: 0, opacity: 0.9 }}>{s.whyUseful}</p>
                </div>
              </div>
              <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                background: 'var(--color-primary)',
                color: '#fff', textAlign: 'center',
                padding: '10px', borderRadius: 6,
                fontWeight: 600, fontSize: 12, display: 'block'
              }}>
                Start Learning Now
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 6. Test Prep Tab
  const renderTestPrep = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Language Test Prep</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>In-depth strategy guidelines for IELTS Academic, TOEFL iBT, and Duolingo English Tests (DET).</p>
        </div>

        {quizActive ? (
          <div style={{
            background: 'var(--color-card)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 28, marginBottom: 32,
            boxShadow: 'var(--shadow-lg)'
          }}>
            {quizScore === null ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    Interactive Mini-Quiz: {quizTest.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                    Question {quizIndex + 1} of {quizQuestions[quizTest].length}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
                  {quizQuestions[quizTest][quizIndex].q}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {quizQuestions[quizTest][quizIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      style={{
                        background: 'var(--color-light)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 16, textAlign: 'left',
                        fontSize: 14, fontWeight: 500,
                        transition: 'all 0.3s'
                      }}
                      className="hover-lift"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 44, display: 'block', marginBottom: 12 }}>🎉</span>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Quiz Completed!</h3>
                <p style={{ fontSize: 15, color: 'var(--color-muted)', marginBottom: 24 }}>
                  You scored <strong>{quizScore.correct} out of {quizScore.total}</strong> ({quizScore.percent}%)
                </p>
                <div style={{ background: 'var(--color-light)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 24, textAlign: 'left' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 10 }}>
                    Explanations:
                  </h4>
                  {quizQuestions[quizTest].map((q, idx) => (
                    <div key={idx} style={{ marginBottom: 12, fontSize: 12, borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                      <p style={{ fontWeight: 600, margin: '0 0 4px' }}>Q: {q.q}</p>
                      <p style={{ color: quizAnswers[idx] === q.answer ? 'var(--color-success)' : 'red', margin: '0 0 4px' }}>
                        Your Answer: {q.options[quizAnswers[idx]]} {quizAnswers[idx] === q.answer ? '(Correct)' : '(Incorrect)'}
                      </p>
                      <p style={{ color: 'var(--color-muted)', margin: 0 }}>{q.explanation}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setQuizActive(false)}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff', padding: '12px 28px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600, fontSize: 13
                  }}
                >
                  Close Quiz
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24, marginBottom: 32,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Test Your Knowledge</h3>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>Choose an exam type to start a brief mini-quiz and test your registration strategy.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => startQuiz('ielts')} style={{ background: 'var(--color-primary)', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
                🇬🇧 Start IELTS Quiz
              </button>
              <button onClick={() => startQuiz('toefl')} style={{ background: 'var(--color-secondary)', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
                🇺🇸 Start TOEFL Quiz
              </button>
              <button onClick={() => startQuiz('det')} style={{ background: 'var(--color-success)', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
                🤖 Start DET Quiz
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 14 }}>🇬🇧 IELTS Academic</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, padding: 0 }}>
              <li><strong>Listening (30 min):</strong> Preview all exam question sheets before tape starts to anticipate synonyms.</li>
              <li><strong>Reading (60 min):</strong> Skim for overall arguments, scan details, and manage time (20 min per passage).</li>
              <li><strong>Writing (60 min):</strong> Outline Task 1 graph summaries (150 words) and Task 2 opinion essays (250 words).</li>
              <li><strong>Speaking (11-14 min):</strong> Face-to-face conversational interview. Focus on natural fluency.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-secondary)', marginBottom: 14 }}>🇺🇸 TOEFL iBT</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, padding: 0 }}>
              <li><strong>Academic Focus:</strong> Fully computer delivered. Evaluates ability to combine listening and reading arguments.</li>
              <li><strong>Reading (54-72 min):</strong> 3 or 4 passages, academic prose, with multiple-choice structures.</li>
              <li><strong>Speaking (17 min):</strong> 4 tasks, recorded via microphone, graded by AI algorithms and human review.</li>
              <li><strong>Writing (50 min):</strong> Integrated and Independent prompts targeting reasoning.</li>
            </ul>
          </div>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-success)', marginBottom: 14 }}>🤖 Duolingo English Test (DET)</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, padding: 0 }}>
              <li><strong>Accessibility:</strong> Take from home on a browser with stable camera access. Cost is only $49 USD.</li>
              <li><strong>Adaptive Testing:</strong> The difficulty of next questions alters dynamically based on previous responses.</li>
              <li><strong>Special Formats:</strong> Interactive reading, writing response pictures, and video interviews.</li>
              <li><strong>Turnaround:</strong> Extremely fast results provided in 2 days, accepted by 1,500+ global schools.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // 7. Resources Tab
  const renderResources = () => {
    const filtered = resources.filter(r => {
      if (resourceFilter !== 'all' && r.category !== resourceFilter) return false;
      return r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Resources Library</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Instantly access physics equations, math slides, biology folders, and sample essays.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
          {['all', 'pdf', 'ppt', 'articles', 'magazines'].map(cat => (
            <button
              key={cat}
              onClick={() => setResourceFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                background: resourceFilter === cat ? 'var(--color-primary)' : 'var(--color-card)',
                color: resourceFilter === cat ? '#fff' : 'var(--color-dark)',
                border: '1px solid var(--color-border)',
                fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap', transition: 'all 0.3s'
              }}
            >
              {cat === 'all' ? '📚 All Materials' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(r => (
            <div 
              key={r.id}
              className="hover-lift"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24, boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    background: 'var(--color-primary-light)15',
                    padding: '2px 6px', borderRadius: 4
                  }}>
                    {r.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{r.size || r.source}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{r.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 8 }}>Subject: {r.subject}</p>
                <p style={{ fontSize: 13, color: 'var(--color-dark)', opacity: 0.8, lineHeight: 1.4, marginBottom: 20 }}>{r.description}</p>
              </div>

              <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <button 
                  onClick={() => alert(`Simulated Download: ${r.title} will download shortly.`)}
                  style={{
                    flex: 1, background: 'var(--color-primary)',
                    color: '#fff', padding: '10px',
                    borderRadius: 6, fontWeight: 600, fontSize: 12
                  }}
                >
                  Download Asset
                </button>
                <button 
                  onClick={() => alert(`Simulated Preview: Loaded successfully in mock preview window.`)}
                  style={{
                    background: 'var(--color-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-dark)',
                    padding: '10px 14px', borderRadius: 6,
                    fontWeight: 600, fontSize: 12
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 8. AI Tutor Tab (Now with Gemini Integration)
  const renderAiTutor = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>AI Study Assistant</h2>
            <span style={{
              background: 'linear-gradient(135deg, #4285F4, #34A853)',
              color: '#fff', fontSize: 9, fontWeight: 800,
              padding: '3px 8px', borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase', letterSpacing: 0.5
            }}>
              Gemini Powered
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Get real-time, intelligent academic guidance from Google Gemini AI.</p>
        </div>

        {/* Suggestion Pills */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
          {[
            "How do I prepare for IELTS?",
            "What scholarships does AAU offer?",
            "Tell me about Sandford Academy",
            "Best free programming courses?"
          ].map(p => (
            <button
              key={p}
              onClick={() => triggerAiResponse(p)}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px', fontSize: 12,
                fontWeight: 600, whiteSpace: 'nowrap',
                color: 'var(--color-dark)',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Logs Window */}
        <div style={{
          flex: 1,
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 20, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 16,
          marginBottom: 16
        }}>
          {aiChat.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }} className="animate-slide-up">
              <div style={{
                background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-light)',
                color: m.role === 'user' ? '#fff' : 'var(--color-dark)',
                border: m.role === 'user' ? 'none' : '1px solid var(--color-border)',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '12px 16px',
                maxWidth: '80%',
                fontSize: 13.5, lineHeight: 1.6,
                boxShadow: 'var(--shadow-sm)',
                whiteSpace: 'pre-wrap'
              }}>
                {m.role === 'bot' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Sparkles size={12} color="var(--color-primary)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>KnowHub AI</span>
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {aiTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                background: 'var(--color-light)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px 16px 16px 4px',
                padding: '14px 20px',
                display: 'flex', gap: 6, alignItems: 'center'
              }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); if (aiMessage.trim()) triggerAiResponse(aiMessage); }} style={{
          display: 'flex', gap: 12,
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 8
        }}>
          <input
            placeholder="Ask anything about education, exams, or careers..."
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            disabled={aiTyping}
            style={{
              flex: 1, border: 'none',
              background: 'transparent',
              color: 'var(--color-dark)', fontSize: 14,
              paddingLeft: 12, fontFamily: 'var(--font-body)',
              outline: 'none',
              opacity: aiTyping ? 0.5 : 1
            }}
          />
          <button 
            type="submit"
            disabled={aiTyping}
            style={{
              background: aiTyping ? 'var(--color-muted)' : 'var(--color-primary)',
              color: '#fff', borderRadius: 8,
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {aiTyping ? <Loader size={16} className="animate-rotate" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    );
  };

  // 9. Progress Tab
  const renderProgress = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>My Progress Tracker</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Visualize studied courses, quiz performance, and strength assessment markers.</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-success) 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: 28, marginBottom: 32,
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>📊 Current Performance Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <div>
              <span style={{ fontSize: 12, opacity: 0.8, display: 'block' }}>Average Quiz Score</span>
              <strong style={{ fontSize: 28, display: 'block', marginTop: 4 }}>88%</strong>
            </div>
            <div>
              <span style={{ fontSize: 12, opacity: 0.8, display: 'block' }}>Goal Achievement</span>
              <strong style={{ fontSize: 28, display: 'block', marginTop: 4 }}>6 / 8 Tasks</strong>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Subject Area Proficiency</h3>
          
          {[
            { name: "IELTS Preparation (Grammar & Reading)", score: 90, color: "var(--color-primary)" },
            { name: "STEM Technologies (Python Programming)", score: 75, color: "var(--color-secondary)" },
            { name: "Essay Formulation & Research writing", score: 60, color: "var(--color-accent)" },
            { name: "Secondary Science Subjects (Physics/Biology)", score: 85, color: "var(--color-success)" }
          ].map(p => (
            <div key={p.name} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                <span>{p.name}</span>
                <span>{p.score}%</span>
              </div>
              <div style={{ height: 10, background: 'var(--color-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div style={{ height: '100%', background: p.color, width: `${p.score}%`, borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 10. Settings Tab
  const renderSettings = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Settings & Configurations</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Configure grade level goals, subject focus filters, database seeding triggers, and visual theme settings.</p>
        </div>

        {/* Account Section */}
        {!isTelegram && (
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 24, boxShadow: 'var(--shadow-sm)',
            marginBottom: 32
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <LogIn size={18} color="var(--color-info)" /> Account
            </h3>
            {authUser ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-warm)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 16
                  }}>
                    {(profile.firstName || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{profile.firstName || 'Student'}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: 0 }}>{authUser.email}</p>
                  </div>
                </div>
                <button onClick={handleSignOut} style={{
                  background: 'none', color: 'var(--color-danger)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 6, padding: '8px 16px',
                  fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 14 }}>
                  Sign in to save your progress, bookmarks, and preferences across devices.
                </p>
                <button onClick={() => setShowAuthModal(true)} style={{
                  background: 'var(--color-primary)', color: '#fff',
                  borderRadius: 6, padding: '10px 20px',
                  fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <LogIn size={16} /> Sign In / Create Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Settings section */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24, boxShadow: 'var(--shadow-sm)',
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="var(--color-primary)" /> Student Settings Profile
          </h3>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
              GRADE LEVEL GOALS
            </label>
            <select
              value={profile.gradeLevel}
              onChange={(e) => handleSaveProfile({ gradeLevel: e.target.value })}
              className="admin-input"
            >
              <option value="all">Select All Grades</option>
              <option value="middle">Middle School</option>
              <option value="high">High School (Grade 9-12)</option>
              <option value="university">University Student</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
              PREFERRED EDUCATION SUBJECTS
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {["Math", "Physics", "Chemistry", "Biology", "Web Dev", "IELTS English"].map(sub => {
                const isSelected = profile.preferredSubjects?.includes(sub);
                return (
                  <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => {
                        const next = isSelected 
                          ? profile.preferredSubjects.filter(p => p !== sub)
                          : [...(profile.preferredSubjects || []), sub];
                        handleSaveProfile({ preferredSubjects: next });
                      }}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    {sub}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>
              APP INTERFACE LANGUAGE
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => handleSaveProfile({ language: 'en' })}
                style={{
                  flex: 1, padding: 10, borderRadius: 6,
                  background: profile.language === 'en' ? 'var(--color-primary)' : 'var(--color-light)',
                  color: profile.language === 'en' ? '#fff' : 'var(--color-dark)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600, fontSize: 12
                }}
              >
                English
              </button>
              <button 
                onClick={() => handleSaveProfile({ language: 'am' })}
                style={{
                  flex: 1, padding: 10, borderRadius: 6,
                  background: profile.language === 'am' ? 'var(--color-primary)' : 'var(--color-light)',
                  color: profile.language === 'am' ? '#fff' : 'var(--color-dark)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600, fontSize: 12
                }}
              >
                አማርኛ (Amharic)
              </button>
            </div>
          </div>
        </div>

        {/* Database Control Center panel */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24, boxShadow: 'var(--shadow-sm)',
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--color-secondary)" /> Database Control Center
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20, lineHeight: 1.4 }}>
            Populate all tables with verified academic datasets in one click.
          </p>

          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            style={{
              background: 'var(--gradient-warm)',
              color: '#fff', borderRadius: 6,
              padding: '12px 24px', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, opacity: isSeeding ? 0.7 : 1, width: '100%'
            }}
          >
            {isSeeding ? (
              <><RefreshCw size={16} className="animate-rotate" /> Seeding Database...</>
            ) : (
              '⚡ One-Click Seeding Database'
            )}
          </button>

          {seederStatus && (
            <div style={{
              background: 'var(--color-light)',
              border: '1px solid var(--color-border)',
              borderRadius: 6, padding: 16, marginTop: 16
            }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>
                Seeding Outcome Log:
              </h4>
              {seederStatus.errors && seederStatus.errors.length > 0 ? (
                <div style={{ color: 'red', fontSize: 12 }}>
                  <p>Errors occurred during database access:</p>
                  <ul style={{ paddingLeft: 16 }}>
                    {seederStatus.errors.map((e, idx) => <li key={idx}>{e}</li>)}
                  </ul>
                </div>
              ) : (
                <div style={{ color: 'var(--color-success)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p>✓ Database populated successfully!</p>
                  <span>🏫 Schools seeded: {seederStatus.schools}</span>
                  <span>💰 Scholarships seeded: {seederStatus.scholarships}</span>
                  <span>🚀 Opportunities seeded: {seederStatus.opportunities}</span>
                  <span>💡 Skills seeded: {seederStatus.skills}</span>
                  <span>📄 Resources seeded: {seederStatus.resources}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Bookmarks panel */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24, boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={18} color="red" fill="red" /> Saved Bookmark Lists ({bookmarks.length})
          </h3>
          {bookmarks.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>You haven't bookmarked any items yet. Navigate through schools or scholarships and tap the heart icon to save them here.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookmarks.map((bm, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--color-light)', padding: '12px 16px',
                  borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 13
                }}>
                  <div>
                    <span style={{ fontWeight: 700, display: 'block' }}>{bm.item_title}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                      {bm.item_type}
                    </span>
                  </div>
                  <button 
                    onClick={async () => {
                      const ok = await api.removeBookmark(userId, bm.item_id, bm.item_type);
                      if (ok) {
                        setBookmarks(prev => prev.filter(b => !(b.item_id === bm.item_id && b.item_type === bm.item_type)));
                      }
                    }}
                    style={{ background: 'none', color: 'red', fontWeight: 600, fontSize: 12 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 11. Admin Tab (Phase 3)
  const renderAdmin = () => {
    const currentItems = adminItemType === 'schools' ? schools
      : adminItemType === 'scholarships' ? scholarships
      : adminItemType === 'opportunities' ? opportunities
      : adminItemType === 'skills' ? skills
      : resources;

    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Admin Workspace</h2>
            <span style={{
              background: 'var(--color-danger)',
              color: '#fff', fontSize: 9, fontWeight: 800,
              padding: '3px 8px', borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase'
            }}>
              Admin Only
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Create, edit, and manage educational content directly from this dashboard.</p>
        </div>

        {/* Item Type Selector */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 24 }}>
          {['schools', 'scholarships', 'opportunities', 'skills', 'resources'].map(type => (
            <button key={type} onClick={() => { setAdminItemType(type); setShowAdminForm(false); }}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-full)',
                background: adminItemType === type ? 'var(--color-secondary)' : 'var(--color-card)',
                color: adminItemType === type ? '#fff' : 'var(--color-dark)',
                border: '1px solid var(--color-border)',
                fontWeight: 600, fontSize: 12,
                whiteSpace: 'nowrap', textTransform: 'capitalize'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Add New Button */}
        <button onClick={() => { setShowAdminForm(!showAdminForm); setAdminForm({}); }}
          style={{
            background: 'var(--color-success)', color: '#fff',
            borderRadius: 8, padding: '10px 20px',
            fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 24
          }}
        >
          <Plus size={16} /> Add New {adminItemType.slice(0, -1)}
        </button>

        {/* Add Form */}
        {showAdminForm && (
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            border: '2px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: 24, marginBottom: 24
          }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              Create New {adminItemType.slice(0, -1)}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {adminItemType === 'schools' && (
                <>
                  <input className="admin-input" placeholder="School Name *" value={adminForm.name || ''} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
                  <input className="admin-input" placeholder="City *" value={adminForm.city || ''} onChange={e => setAdminForm({...adminForm, city: e.target.value})} />
                  <input className="admin-input" placeholder="Region *" value={adminForm.region || ''} onChange={e => setAdminForm({...adminForm, region: e.target.value})} />
                  <input className="admin-input" placeholder="Curriculum *" value={adminForm.curriculum || ''} onChange={e => setAdminForm({...adminForm, curriculum: e.target.value})} />
                  <input className="admin-input" placeholder="Phone" value={adminForm.phone || ''} onChange={e => setAdminForm({...adminForm, phone: e.target.value})} />
                  <input className="admin-input" placeholder="Email" value={adminForm.email || ''} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
                  <textarea className="admin-input" placeholder="Description" style={{ gridColumn: '1/-1', minHeight: 80, resize: 'vertical' }} value={adminForm.description || ''} onChange={e => setAdminForm({...adminForm, description: e.target.value})} />
                </>
              )}
              {adminItemType === 'scholarships' && (
                <>
                  <input className="admin-input" placeholder="Title *" value={adminForm.title || ''} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
                  <input className="admin-input" placeholder="Organization *" value={adminForm.organization || ''} onChange={e => setAdminForm({...adminForm, organization: e.target.value})} />
                  <input className="admin-input" placeholder="Region *" value={adminForm.region || ''} onChange={e => setAdminForm({...adminForm, region: e.target.value})} />
                  <input className="admin-input" placeholder="Amount *" value={adminForm.amount || ''} onChange={e => setAdminForm({...adminForm, amount: e.target.value})} />
                  <input className="admin-input" placeholder="Eligibility *" value={adminForm.eligibility || ''} onChange={e => setAdminForm({...adminForm, eligibility: e.target.value})} />
                  <input className="admin-input" type="date" placeholder="Deadline *" value={adminForm.deadline || ''} onChange={e => setAdminForm({...adminForm, deadline: e.target.value})} />
                  <input className="admin-input" placeholder="Link" style={{ gridColumn: '1/-1' }} value={adminForm.link || ''} onChange={e => setAdminForm({...adminForm, link: e.target.value})} />
                  <textarea className="admin-input" placeholder="Description" style={{ gridColumn: '1/-1', minHeight: 80, resize: 'vertical' }} value={adminForm.description || ''} onChange={e => setAdminForm({...adminForm, description: e.target.value})} />
                </>
              )}
              {adminItemType === 'opportunities' && (
                <>
                  <input className="admin-input" placeholder="Title *" value={adminForm.title || ''} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
                  <input className="admin-input" placeholder="Category *" value={adminForm.category || ''} onChange={e => setAdminForm({...adminForm, category: e.target.value})} />
                  <input className="admin-input" placeholder="Level *" value={adminForm.level || ''} onChange={e => setAdminForm({...adminForm, level: e.target.value})} />
                  <input className="admin-input" placeholder="Duration *" value={adminForm.duration || ''} onChange={e => setAdminForm({...adminForm, duration: e.target.value})} />
                  <input className="admin-input" type="date" placeholder="Deadline *" value={adminForm.deadline || ''} onChange={e => setAdminForm({...adminForm, deadline: e.target.value})} />
                  <input className="admin-input" placeholder="Link" value={adminForm.link || ''} onChange={e => setAdminForm({...adminForm, link: e.target.value})} />
                  <textarea className="admin-input" placeholder="Description *" style={{ gridColumn: '1/-1', minHeight: 80, resize: 'vertical' }} value={adminForm.description || ''} onChange={e => setAdminForm({...adminForm, description: e.target.value})} />
                </>
              )}
              {adminItemType === 'skills' && (
                <>
                  <input className="admin-input" placeholder="Title *" value={adminForm.title || ''} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
                  <input className="admin-input" placeholder="Category *" value={adminForm.category || ''} onChange={e => setAdminForm({...adminForm, category: e.target.value})} />
                  <input className="admin-input" placeholder="Platform *" value={adminForm.platform || ''} onChange={e => setAdminForm({...adminForm, platform: e.target.value})} />
                  <input className="admin-input" placeholder="Duration *" value={adminForm.duration || ''} onChange={e => setAdminForm({...adminForm, duration: e.target.value})} />
                  <input className="admin-input" placeholder="Level *" value={adminForm.level || ''} onChange={e => setAdminForm({...adminForm, level: e.target.value})} />
                  <input className="admin-input" placeholder="Link *" value={adminForm.link || ''} onChange={e => setAdminForm({...adminForm, link: e.target.value})} />
                  <textarea className="admin-input" placeholder="Description *" style={{ gridColumn: '1/-1', minHeight: 80, resize: 'vertical' }} value={adminForm.description || ''} onChange={e => setAdminForm({...adminForm, description: e.target.value})} />
                </>
              )}
              {adminItemType === 'resources' && (
                <>
                  <input className="admin-input" placeholder="Title *" value={adminForm.title || ''} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
                  <input className="admin-input" placeholder="Category *" value={adminForm.category || ''} onChange={e => setAdminForm({...adminForm, category: e.target.value})} />
                  <input className="admin-input" placeholder="Subject *" value={adminForm.subject || ''} onChange={e => setAdminForm({...adminForm, subject: e.target.value})} />
                  <input className="admin-input" placeholder="Source" value={adminForm.source || ''} onChange={e => setAdminForm({...adminForm, source: e.target.value})} />
                  <textarea className="admin-input" placeholder="Description" style={{ gridColumn: '1/-1', minHeight: 80, resize: 'vertical' }} value={adminForm.description || ''} onChange={e => setAdminForm({...adminForm, description: e.target.value})} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleAdminCreate} disabled={adminSaving}
                style={{
                  background: 'var(--color-primary)', color: '#fff',
                  borderRadius: 6, padding: '10px 20px',
                  fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                  opacity: adminSaving ? 0.7 : 1
                }}
              >
                {adminSaving ? <><Loader size={14} className="animate-rotate" /> Saving...</> : <><Check size={14} /> Create Item</>}
              </button>
              <button onClick={() => setShowAdminForm(false)}
                style={{
                  background: 'var(--color-light)', color: 'var(--color-dark)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6, padding: '10px 20px',
                  fontSize: 13, fontWeight: 600
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentItems.map(item => (
            <div key={item.id} style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name || item.title}</span>
                <span style={{ fontSize: 11, color: 'var(--color-muted)', display: 'block', marginTop: 2 }}>
                  ID: {item.id}
                </span>
              </div>
              <button onClick={() => handleAdminDelete(adminItemType, item.id)}
                style={{
                  background: 'none', color: 'var(--color-danger)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 600
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'var(--color-light)',
      minHeight: '100vh',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-dark)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Header Navigation Bar */}
      <header style={{
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 90,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient-warm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 14
          }}>
            KH
          </span>
          <div>
            <strong style={{ fontSize: 15, display: 'block', letterSpacing: '-0.3px' }}>KnowHub App</strong>
            <span style={{ fontSize: 10, color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Student Portal
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isTelegram && (
            <button 
              onClick={onBackToLanding}
              style={{
                background: 'none', color: 'var(--color-primary)',
                fontSize: 12, fontWeight: 700,
                border: '1px solid var(--color-primary)',
                padding: '6px 12px', borderRadius: 6
              }}
            >
              Landing Page
            </button>
          )}

          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--color-light)',
              border: '1px solid var(--color-border)',
              borderRadius: 8, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-dark)'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Tab View Controller container */}
      <main style={{ flex: 1, paddingBottom: 100 }}>
        {loading ? (
          <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <RefreshCw size={36} color="var(--color-primary)" className="animate-rotate" style={{ marginBottom: 12 }} />
              <span style={{ fontSize: 13, color: 'var(--color-muted)', display: 'block' }}>Loading educational databases...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'schools' && renderSchools()}
            {activeTab === 'scholarships' && renderScholarships()}
            {activeTab === 'opportunities' && renderOpportunities()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'testprep' && renderTestPrep()}
            {activeTab === 'resources' && renderResources()}
            {activeTab === 'aitutor' && renderAiTutor()}
            {activeTab === 'progress' && renderProgress()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'admin' && profile.isAdmin && renderAdmin()}
          </>
        )}
      </main>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-around',
        padding: '12px 0 20px', zIndex: 100,
        boxShadow: 'var(--shadow-lg)'
      }}>
        {[
          { id: 'home', label: 'Home', icon: <Home size={18} /> },
          { id: 'schools', label: 'Schools', icon: <GraduationCap size={18} /> },
          { id: 'aitutor', label: 'AI Tutor', icon: <Sparkles size={18} /> },
          { id: 'resources', label: 'Library', icon: <FileText size={18} /> },
          ...(profile.isAdmin ? [{ id: 'admin', label: 'Admin', icon: <Shield size={18} /> }] : []),
          { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        ].map(nav => {
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              style={{
                background: 'none', border: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s' }}>
                {nav.icon}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700 }}>
                {nav.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* --- SCHOOL DETAIL MODAL DIALOG --- */}
      {selectedSchool && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: 560, padding: 28,
            position: 'relative', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => { setSelectedSchool(null); setNewComment(''); }}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'var(--color-dark)' }}
            >
              <X size={20} />
            </button>
            <span style={{
              background: 'var(--color-primary-light)15',
              color: 'var(--color-primary-dark)',
              padding: '4px 10px', borderRadius: 4,
              fontSize: 10, fontWeight: 800,
              display: 'inline-block', marginBottom: 16
            }}>
              {selectedSchool.curriculum}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{selectedSchool.name}</h3>
            
            <p style={{ fontSize: 13, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <MapPin size={15} color="var(--color-primary)" /> {selectedSchool.city}, {selectedSchool.region}
            </p>

            <p style={{ fontSize: 14, color: 'var(--color-dark)', opacity: 0.9, lineHeight: 1.6, marginBottom: 24 }}>
              {selectedSchool.description}
            </p>

            <div style={{
              background: 'var(--color-light)',
              border: '1px solid var(--color-border)',
              borderRadius: 8, padding: 16, marginBottom: 24,
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block', fontWeight: 700 }}>
                QUICK INSTITUTION STATS
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                <span>Established: {selectedSchool.established}</span>
                <span>Students: {selectedSchool.studentCount}+</span>
                <span>Rating score: ★ {selectedSchool.rating}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 700 }}>CONTACT CHANNELS</span>
              <a href={`tel:${selectedSchool.phone}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--color-primary)', fontSize: 13, fontWeight: 600
              }}>
                <Phone size={15} /> Call Administrative Desk ({selectedSchool.phone})
              </a>
              <a href={`mailto:${selectedSchool.email}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--color-primary)', fontSize: 13, fontWeight: 600
              }}>
                <Mail size={15} /> Send Admissions Mail ({selectedSchool.email})
              </a>
            </div>

            {/* Social Panel: Likes & Comments */}
            {renderSocialPanel(selectedSchool.id, 'school')}
          </div>
        </div>
      )}

      {/* --- SCHOLARSHIP DETAIL MODAL DIALOG --- */}
      {selectedScholarship && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: 560, padding: 28,
            position: 'relative', maxHeight: '85vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => { setSelectedScholarship(null); setNewComment(''); }}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'var(--color-dark)' }}
            >
              <X size={20} />
            </button>
            <span style={{
              background: 'var(--color-success)15',
              color: 'var(--color-success)',
              padding: '4px 10px', borderRadius: 4,
              fontSize: 10, fontWeight: 800,
              display: 'inline-block', marginBottom: 16
            }}>
              {selectedScholarship.amount}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{selectedScholarship.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>
              {selectedScholarship.organization} • {selectedScholarship.region}
            </p>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                ELIGIBILITY LIMITS
              </span>
              <p style={{ fontSize: 14, margin: 0, fontWeight: 600, color: 'var(--color-dark)' }}>
                {selectedScholarship.eligibility}
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                PROGRAM DESCRIPTION
              </span>
              <p style={{ fontSize: 13.5, color: 'var(--color-dark)', opacity: 0.9, lineHeight: 1.5, margin: 0 }}>
                {selectedScholarship.description}
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 700, display: 'block', marginBottom: 10 }}>
                DOCUMENTS / REQUIREMENTS
              </span>
              <ul style={{ paddingLeft: 20, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedScholarship.requirements.map(req => (
                  <li key={req} style={{ color: 'var(--color-dark)' }}>{req}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 18, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'red', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={14} /> Close Date: {selectedScholarship.deadline}
              </span>
              <a 
                href={selectedScholarship.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'var(--color-primary)', color: '#fff',
                  padding: '10px 20px', borderRadius: 6,
                  fontWeight: 600, fontSize: 12
                }}
              >
                Apply Externally
              </a>
            </div>

            {/* Social Panel: Likes & Comments */}
            {renderSocialPanel(selectedScholarship.id, 'scholarship')}
          </div>
        </div>
      )}

      {/* --- AUTH MODAL (Browser Only) --- */}
      {showAuthModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, backdropFilter: 'blur(8px)'
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            borderRadius: 'var(--radius-xl)',
            width: '100%', maxWidth: 420, padding: '40px 32px',
            position: 'relative',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <button 
              onClick={() => { setShowAuthModal(false); setAuthError(''); }}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'var(--color-muted)' }}
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--gradient-warm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: 'var(--shadow-glow-primary)'
              }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>KH</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                {authMode === 'login' ? 'Sign in to continue your learning journey' : 'Join KnowHub Ethiopia today'}
              </p>
            </div>

            {authError && (
              <div style={{
                background: 'rgba(231,76,60,0.08)',
                border: '1px solid rgba(231,76,60,0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: 'var(--color-danger)'
              }}>
                <AlertCircle size={14} /> {authError}
              </div>
            )}

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {authMode === 'signup' && (
                <input 
                  className="auth-input"
                  type="text"
                  placeholder="Full Name"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  required
                />
              )}
              <input 
                className="auth-input"
                type="email"
                placeholder="Email Address"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />
              <div style={{ position: 'relative' }}>
                <input 
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--color-muted)'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" disabled={authLoading}
                style={{
                  background: 'var(--gradient-warm)',
                  color: '#fff', borderRadius: 'var(--radius-md)',
                  padding: '14px', fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 8, opacity: authLoading ? 0.7 : 1,
                  boxShadow: 'var(--shadow-glow-primary)'
                }}
              >
                {authLoading ? (
                  <><Loader size={16} className="animate-rotate" /> Processing...</>
                ) : authMode === 'login' ? (
                  <><LogIn size={16} /> Sign In</>
                ) : (
                  <><UserPlus size={16} /> Create Account</>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-muted)', marginTop: 20 }}>
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
                style={{ background: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: 13 }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
