import { useState, useEffect } from 'react';
import { 
  Home, BookOpen, GraduationCap, Compass, Lightbulb, 
  FileText, MessageSquare, BarChart2, Settings, Heart, 
  Search, Moon, Sun, ChevronRight, MapPin, Calendar, 
  Phone, Mail, X, Check, ArrowRight, Play, RefreshCw, 
  Send, Award, Award as Trophy, BookMarked, User, Globe
} from 'lucide-react';
import { api } from '../services/api';

const standardColors = {
  primary: '#D4672E',
  secondary: '#1B3A42',
  accent: '#F7A940',
  success: '#2B7A68',
  light: '#F8F6F1',
  dark: '#1A1A1A',
  border: '#E8DCC8',
  muted: '#7A7A7A',
  card: '#FFFFFF',
  surface: '#FDF9F3'
};

const quizQuestions = {
  ielts: [
    {
      q: "In IELTS Listening, how many sections are there in total?",
      options: ["2 Sections", "3 Sections", "4 Sections", "5 Sections"],
      answer: 2, // "4 Sections"
      explanation: "The IELTS Listening test has 4 sections with 10 questions each, making a total of 40 questions."
    },
    {
      q: "What is the recommended minimum word count for IELTS Writing Task 2?",
      options: ["150 words", "200 words", "250 words", "300 words"],
      answer: 2, // "250 words"
      explanation: "Writing Task 2 requires a minimum of 250 words and counts for two-thirds of your overall writing score."
    },
    {
      q: "Which skill is NOT tested directly in the IELTS Speaking exam?",
      options: ["Pronunciation", "Spelling", "Lexical Resource", "Grammatical Accuracy"],
      answer: 1, // "Spelling"
      explanation: "Speaking evaluates fluency, pronunciation, grammar, and vocabulary. Spelling is evaluated in Listening and Writing."
    }
  ],
  toefl: [
    {
      q: "What is the maximum possible score on the TOEFL iBT exam?",
      options: ["9.0 points", "100 points", "120 points", "160 points"],
      answer: 2, // "120 points"
      explanation: "Each of the four sections (Reading, Listening, Speaking, Writing) is scored from 0-30, totaling 120 points."
    },
    {
      q: "How are the speaking responses recorded in the TOEFL iBT?",
      options: ["Interview with live examiner", "Speaking into a microphone/computer", "Written transcript of spoken audio", "None of the above"],
      answer: 1, // "Speaking into a microphone/computer"
      explanation: "TOEFL Speaking is fully automated/computer-delivered; you speak into a microphone, and your answers are evaluated by AI and human markers."
    }
  ],
  det: [
    {
      q: "What is the general registration cost of the Duolingo English Test (DET)?",
      options: ["$49 USD", "$100 USD", "$150 USD", "$220 USD"],
      answer: 0, // "$49 USD"
      explanation: "The DET is exceptionally affordable at only $49 USD, compared to other exams costing over $200 USD."
    },
    {
      q: "Where do students take the Duolingo English Test?",
      options: ["At a certified testing center", "At any quiet room with a computer and camera", "Through a Telegram bot script", "At local embassies"],
      answer: 1, // "At any quiet room with a computer and camera"
      explanation: "The DET is taken online, at home, requiring only a stable computer, internet, front camera, and microphone."
    }
  ]
};

export default function Dashboard({ isTelegram, user: tgUser, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
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
    language: 'en'
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
    { role: 'bot', text: "Hello! I am your KnowHub Study Assistant. Ask me anything about Ethiopian universities, international scholarship deadlines, study habits, or standardized exam tests!" }
  ]);

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const uId = tgUser?.id || 'guest-user';
        setUserId(uId);
        
        const [schs, schols, opps, sks, res, bms, prof] = await Promise.all([
          api.getSchools(),
          api.getScholarships(),
          api.getOpportunities(),
          api.getSkills(),
          api.getResources(),
          api.getBookmarks(uId),
          api.getProfile(uId, {
            username: tgUser?.username || 'Guest',
            firstName: tgUser?.first_name || 'Guest Student',
            gradeLevel: 'all',
            preferredSubjects: [],
            language: 'en'
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
  }, [tgUser]);

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

  // Theme Toggler
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
      // Reload lists
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
      // Calculate score
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

  // AI Chat Bot Helpers
  const triggerAiResponse = (userText) => {
    const chat = [...aiChat, { role: 'user', text: userText }];
    setAiChat(chat);
    setAiMessage('');

    // Custom Mock Answers based on keywords
    setTimeout(() => {
      let botResponse = "That is an interesting topic! While I fetch that specific guidance, you can check our dedicated 'Schools' tab for institution data or 'Tests' tab for practice materials.";
      
      const txt = userText.toLowerCase();
      if (txt.includes('hello') || txt.includes('hi ')) {
        botResponse = "Hello! Hope your studies are going wonderfully today. How can I assist your educational journey in Ethiopia?";
      } else if (txt.includes('ielts') || txt.includes('toefl') || txt.includes('english')) {
        botResponse = "Preparing for English assessments? We offer comprehensive study guides for IELTS, TOEFL, and Duolingo English Tests (DET) under the 'Tests' tab. Make sure to try our interactive quiz engine!";
      } else if (txt.includes('scholarship') || txt.includes('funding') || txt.includes('mastercard')) {
        botResponse = "The Mastercard Foundation Scholars Program at AAU is highly recommended. It offers full tuition, stipends, and housing. Deadlines are usually in late August. Check our 'Scholarships' tab for more details!";
      } else if (txt.includes('school') || txt.includes('university') || txt.includes('academy')) {
        botResponse = "We have detailed listings for 20+ top institutions like Sandford Academy, Ethio-Japan School, and AAU. Go to the 'Schools' tab and filter by region or curriculum (IB, National, Cambridge).";
      } else if (txt.includes('physics') || txt.includes('math') || txt.includes('biology')) {
        botResponse = "Need study materials? Head over to our 'Resources' library to instantly preview or download Calculus slides, Cell Mitosis presentations, and Physics equation sheets!";
      }

      setAiChat([...chat, { role: 'bot', text: botResponse }]);
    }, 800);
  };

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
          {/* Background overlay details */}
          <div style={{
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(214, 103, 46, 0.25) 0%, transparent 70%)',
            top: '-20%',
            right: '-10%'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-accent-light)',
              marginBottom: 16
            }}>
              💡 Student Hub Dashboard
            </span>
            <h1 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: 8,
              lineHeight: 1.2
            }}>
              Welcome Back, {profile.firstName || 'Student'}!
            </h1>
            <p style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: 480,
              lineHeight: 1.5
            }}>
              Explore real-time resources, review your standardized test goals, and continue your journey toward excellence.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Search size={20} color="var(--color-primary)" />
            <input 
              placeholder="Search schools, scholarships, study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-dark)',
                fontSize: 15,
                width: '100%',
                fontFamily: 'var(--font-body)',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', color: 'var(--color-muted)' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginTop: 8,
              padding: 16,
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 16
          }}>
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>🔥</span>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block' }}>Daily Streak</span>
              <strong style={{ fontSize: 20, color: 'var(--color-primary)' }}>{activeStreak} Days</strong>
            </div>
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>⏱️</span>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block' }}>Hours Studied</span>
              <strong style={{ fontSize: 20, color: 'var(--color-secondary)' }}>{hoursStudied}h</strong>
            </div>
            <div style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>💖</span>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block' }}>Bookmarks</span>
              <strong style={{ fontSize: 20, color: 'var(--color-accent)' }}>{bookmarks.length} Items</strong>
            </div>
          </div>
        </div>

        {/* Feature Section Grid */}
        <div style={{ padding: '0 24px', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Explore Programs</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16
          }}>
            {[
              { id: 'schools', title: 'Discover Schools', desc: 'Browse 20+ top high schools and public universities inside Ethiopia.', icon: <GraduationCap size={24} color="#fff" />, color: 'var(--color-primary)' },
              { id: 'scholarships', title: 'Scholarships', desc: 'Unlock active funding programs tailored for East African students.', icon: <Compass size={24} color="#fff" />, color: 'var(--color-secondary)' },
              { id: 'testprep', title: 'Language Tests', desc: 'Full instructions and practice quizzes for IELTS, TOEFL, and DET.', icon: <Award size={24} color="#fff" />, color: 'var(--color-success)' },
              { id: 'aitutor', title: 'AI Study Assistant', desc: 'Communicate with a friendly virtual helper for educational answers.', icon: <MessageSquare size={24} color="#fff" />, color: 'var(--color-accent)' },
            ].map(f => (
              <div 
                key={f.id} 
                onClick={() => setActiveTab(f.id)}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                className="hover-lift"
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: f.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
            display: 'flex',
            flexDirection: 'column',
            gap: 16
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
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
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

        {/* Filter Toolbar */}
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
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {cur === 'all' ? '🏫 All Curriculums' : cur}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <div 
              key={s.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button 
                onClick={() => handleToggleBookmark(s, 'school')}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'none',
                  color: isBookmarked(s.id, 'school') ? 'var(--color-primary)' : 'var(--color-muted)'
                }}
              >
                <Heart size={20} fill={isBookmarked(s.id, 'school') ? 'var(--color-primary)' : 'none'} />
              </button>
              <span style={{
                background: 'var(--color-primary-light)15',
                color: 'var(--color-primary-dark)',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                display: 'inline-block',
                marginBottom: 12
              }}>
                {s.curriculum}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, paddingRight: 24 }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <MapPin size={14} color="var(--color-primary)" /> {s.city}, {s.region}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Established: {s.established}</span>
                <button 
                  onClick={() => setSelectedSchool(s)}
                  style={{
                    background: 'var(--color-secondary)',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 600
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

        {/* Filter Toolbar */}
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
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {reg === 'all' ? '🌍 All Regions' : reg}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <div 
              key={s.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <button 
                  onClick={() => handleToggleBookmark(s, 'scholarship')}
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'none',
                    color: isBookmarked(s.id, 'scholarship') ? 'var(--color-primary)' : 'var(--color-muted)'
                  }}
                >
                  <Heart size={20} fill={isBookmarked(s.id, 'scholarship') ? 'var(--color-primary)' : 'none'} />
                </button>
                <span style={{
                  background: 'var(--color-success)15',
                  color: 'var(--color-success)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'inline-block',
                  marginBottom: 12
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
                    color: '#fff',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 600
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
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{
                  background: 'var(--color-accent)15',
                  color: 'var(--color-primary-dark)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700
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
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
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

        {/* Filter Toolbar */}
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
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
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
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
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
                color: '#fff',
                textAlign: 'center',
                padding: '10px',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12,
                display: 'block'
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

        {/* Dynamic Interactive Quiz Module */}
        {quizActive ? (
          <div style={{
            background: 'var(--color-card)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            marginBottom: 32,
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
                        padding: 16,
                        textAlign: 'left',
                        fontSize: 14,
                        fontWeight: 500,
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
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: 13
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
            padding: 24,
            marginBottom: 32,
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

        {/* Static Strategy Outlines */}
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

        {/* Filter Toolbar */}
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
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {cat === 'all' ? '📚 All Materials' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(r => (
            <div 
              key={r.id}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    background: 'var(--color-primary-light)15',
                    padding: '2px 6px',
                    borderRadius: 4
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
                    flex: 1,
                    background: 'var(--color-primary)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 12
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
                    padding: '10px 14px',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 12
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

  // 8. AI Tutor Tab
  const renderAiTutor = () => {
    return (
      <div className="animate-fade-in" style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>AI Study Assistant</h2>
          <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Get instantaneous answers regarding high schools, universities, or preparation guides.</p>
        </div>

        {/* Suggestion Pills */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
          {[
            "How do I prepare for IELTS?",
            "What scholarships does AAU offer?",
            "Tell me about Sandford Academy",
            "Are there free programming classes?"
          ].map(p => (
            <button
              key={p}
              onClick={() => triggerAiResponse(p)}
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: 'var(--color-dark)'
              }}
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
          padding: 20,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 16
        }}>
          {aiChat.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-light)',
                color: m.role === 'user' ? '#fff' : 'var(--color-dark)',
                border: m.role === 'user' ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                maxWidth: '75%',
                fontSize: 13.5,
                lineHeight: 1.5,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); if (aiMessage.trim()) triggerAiResponse(aiMessage); }} style={{
          display: 'flex',
          gap: 12,
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 8
        }}>
          <input
            placeholder="Type your study question..."
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: 'var(--color-dark)',
              fontSize: 14,
              paddingLeft: 12,
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          />
          <button 
            type="submit"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 6,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
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

        {/* Weekly Stats Summary Panel */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-success) 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          marginBottom: 32,
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

        {/* Subject Area Strength Progress Bars */}
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
                <div style={{ height: '100%', background: p.color, width: `${p.score}%`, borderRadius: 'var(--radius-full)' }} />
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

        {/* Profile Settings section */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
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
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-light)',
                color: 'var(--color-dark)',
                outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
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
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  background: profile.language === 'en' ? 'var(--color-primary)' : 'var(--color-light)',
                  color: profile.language === 'en' ? '#fff' : 'var(--color-dark)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                English
              </button>
              <button 
                onClick={() => handleSaveProfile({ language: 'am' })}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  background: profile.language === 'am' ? 'var(--color-primary)' : 'var(--color-light)',
                  color: profile.language === 'am' ? '#fff' : 'var(--color-dark)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600,
                  fontSize: 12
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
          padding: 24,
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--color-secondary)" /> Database Control Center
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20, lineHeight: 1.4 }}>
            Since your Supabase tables are currently empty, you can populate all tables (schools, scholarships, opportunities, skills, resources) with our verified academic datasets in one click!
          </p>

          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            style={{
              background: 'var(--gradient-warm)',
              color: '#fff',
              borderRadius: 6,
              padding: '12px 24px',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: isSeeding ? 0.7 : 1,
              width: '100%'
            }}
          >
            {isSeeding ? (
              <>
                <RefreshCw size={16} className="animate-rotate" /> Seeding Database...
              </>
            ) : (
              '⚡ One-Click Seeding Database'
            )}
          </button>

          {seederStatus && (
            <div style={{
              background: 'var(--color-light)',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              padding: 16,
              marginTop: 16
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
                  <p style={{ marginTop: 8 }}><em>Note: Please confirm your Supabase project schema tables are fully created using the SQL script before executing the seeder. Fallback mock arrays are active.</em></p>
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

        {/* Profile Saved Bookmarks panel */}
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          boxShadow: 'var(--shadow-sm)'
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-light)',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  fontSize: 13
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

  return (
    <div style={{
      background: 'var(--color-light)',
      minHeight: '100vh',
      fontFamily: 'var(--font-body)',
      color: 'var(--color-dark)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header Navigation Bar */}
      <header style={{
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--gradient-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: 14
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
          {/* Back button shown only in browser fallback context */}
          {!isTelegram && (
            <button 
              onClick={onBackToLanding}
              style={{
                background: 'none',
                color: 'var(--color-primary)',
                fontSize: 12,
                fontWeight: 700,
                border: '1px solid var(--color-primary)',
                padding: '6px 12px',
                borderRadius: 6
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
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          </>
        )}
      </main>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-card)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0 20px',
        zIndex: 100,
        boxShadow: 'var(--shadow-lg)'
      }}>
        {[
          { id: 'home', label: 'Home', icon: <Home size={18} /> },
          { id: 'schools', label: 'Schools', icon: <GraduationCap size={18} /> },
          { id: 'testprep', label: 'Tests', icon: <Award size={18} /> },
          { id: 'resources', label: 'Library', icon: <FileText size={18} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        ].map(nav => {
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
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
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: 540,
            padding: 28,
            position: 'relative',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setSelectedSchool(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'var(--color-dark)' }}
            >
              <X size={20} />
            </button>
            <span style={{
              background: 'var(--color-primary-light)15',
              color: 'var(--color-primary-dark)',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: 16
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
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 700 }}>CONTACT CHANNELS</span>
              <a href={`tel:${selectedSchool.phone}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--color-primary)',
                fontSize: 13,
                fontWeight: 600
              }}>
                <Phone size={15} /> Call Administrative Desk ({selectedSchool.phone})
              </a>
              <a href={`mailto:${selectedSchool.email}`} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--color-primary)',
                fontSize: 13,
                fontWeight: 600
              }}>
                <Mail size={15} /> Send Admissions Mail ({selectedSchool.email})
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- SCHOLARSHIP DETAIL MODAL DIALOG --- */}
      {selectedScholarship && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="animate-scale-in" style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: 560,
            padding: 28,
            position: 'relative',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setSelectedScholarship(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', color: 'var(--color-dark)' }}
            >
              <X size={20} />
            </button>
            <span style={{
              background: 'var(--color-success)15',
              color: 'var(--color-success)',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: 16
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
              <span style={{ fontSize: 12, color: 'red', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={14} /> Close Date: {selectedScholarship.deadline}
              </span>
              <a 
                href={selectedScholarship.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 12
                }}
              >
                Apply Externally
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
