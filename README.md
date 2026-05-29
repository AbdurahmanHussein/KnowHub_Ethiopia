# KnowHub Ethiopia 🇪🇹

Welcome to **KnowHub Ethiopia**, a premium, modern, and highly responsive web application designed for both normal desktop/mobile browsers and as a **Telegram Mini App**. 

Our mission is to empower Ethiopian students by providing free, centralized access to schools, scholarships, test preparation guides, study resources, and academic opportunities.

---

## ✨ Features

- **📱 Dual Mode Support**: Seamlessly integrates with the Telegram Mini App SDK with graceful fallback for regular web browsers.
- **🎨 Modern Premium UI/UX**: Vibrant, harmonious color schemes with glassmorphism, custom scrollbars, and smooth micro-animations.
- **⚡ Built for Speed**: Powered by Vite and React 19 for instantaneous page loads and lightning-fast navigation.
- **📊 Real-time Stats**: Track 45+ Schools, 120+ Scholarships, 80+ Key Opportunities, and 200+ Free Courses.
- **📚 Curated Resources**: Comprehensive sections for IELTS/TOEFL preparation, study materials, and AI-powered tutoring.
- **🤖 AI Study Assistant**: Google Gemini-powered AI tutor available 24/7 (requires API key setup).
- **🔐 Secure Authentication**: Email/password auth via Supabase with session management.
- **⭐ User Features**: Bookmarks, likes, comments, admin panel for content management.
- **🎯 100% Free**: Built entirely to support student journeys without registrations or hidden fees.

---

## 🛠️ Technology Stack

- **Core Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **AI Tutor**: [Google Gemini API](https://ai.google.dev/)
- **Styling**: Pure vanilla CSS with custom variables, smooth transitions, modular layout.
- **Platform Integration**: Telegram WebApp SDK (for mini-app functionality)
- **Deployment**: Vercel (serverless functions for `/api/tutor`)

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8+)
- **Supabase Project** (free tier available at [supabase.com](https://supabase.com))
- **Google Gemini API Key** (optional, for AI tutor — get it at [ai.google.dev](https://ai.google.dev))

### ⚙️ Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AbdurahmanHussein/KnowHub_Ethiopia.git
   cd "Jemil App"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file (or `.env` for development):
   ```bash
   # Copy from .env.example
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   GEMINI_API_KEY=your-gemini-key  # Optional: without this, AI tutor runs in offline mode
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Lint & Build for Production**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🌐 Deployment to Vercel

This project is fully configured for zero-config deployment on Vercel with support for serverless functions.

### Setup Steps:

1. **Connect GitHub**:
   - Go to [Vercel](https://vercel.com) and create a new project
   - Import this repository from GitHub

2. **Environment Variables**:
   In the Vercel dashboard, add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (required for AI tutor functionality)

3. **Deploy**:
   - Click **Deploy** — Vercel automatically detects Vite as the framework
   - The `vercel.json` config ensures proper SPA routing (no 404 errors)

4. **AI Tutor Serverless Proxy**:
   - The `/api/tutor` endpoint (defined in `api/tutor.js`) automatically runs as a Vercel serverless function
   - It proxies requests to the Gemini API securely without exposing your API key to the frontend
   - **Status**: Without `GEMINI_API_KEY`, the AI tutor falls back to pre-written helpful responses

---

## 🗄️ Database Setup (Supabase)

### Prerequisites:
- Free Supabase project at [supabase.com](https://supabase.com)

### Schema:

Run the SQL in `supabase_schema.sql` in your Supabase SQL Editor:

```sql
-- Create tables for institutions, scholarships, opportunities, skills, resources
-- Includes RLS (Row Level Security) for user bookmarks, profiles, likes, comments
```

Or use the **Supabase CLI** to auto-seed:
```bash
supabase db push
```

---

## 🤖 AI Tutor Configuration

### How It Works:
1. **Frontend** (`src/pages/Dashboard.jsx`): Sends messages to `/api/tutor`
2. **Serverless Proxy** (`api/tutor.js`): Runs on Vercel, calls Google Gemini API
3. **Google Gemini**: Generates intelligent responses for educational queries
4. **Fallback**: If API key is missing, the app uses pre-written helpful responses

### To Enable AI Tutor:
1. Get a free API key from [ai.google.dev](https://ai.google.dev)
2. Add `GEMINI_API_KEY` to your Vercel environment
3. Restart deployment

### Without API Key:
- AI Tutor runs in **offline mode** with pre-written, helpful responses
- App remains fully functional

---

## 📝 Environment Variables Reference

See `.env.example` for the full list:

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key |
| `GEMINI_API_KEY` | ❌ Optional | Google Gemini API (for AI tutor) |
| `VITE_DEBUG_MODE` | ❌ Optional | Enable debug logging |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

### Development Workflow:
1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Run lint: `npm run lint`
4. Commit and push: `git push origin feature/my-feature`
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎓 Project Structure

```
src/
  components/       # Reusable UI components (Navbar, Hero, etc.)
  pages/            # Full page components (Dashboard, LandingPage, AuthPage)
  services/         # API client layer (Supabase, Gemini proxy)
  data/             # Mock data (schools, scholarships, resources, etc.)
  hooks/            # Custom React hooks (useTelegram)
api/
  tutor.js          # Vercel serverless function for AI tutor proxy
public/             # Static assets
vercel.json         # Vercel deployment config
supabase_schema.sql # Database schema
.env.example        # Environment template
```

---

## 🐛 Troubleshooting

### "Supabase connection failed"
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Ensure your Supabase project is active

### "AI Tutor returns offline message"
- Add `GEMINI_API_KEY` to your environment
- Restart the dev server or redeploy on Vercel

### "Telegram Mini App not loading"
- Ensure the app is embedded in the Telegram bot correctly
- Check browser console for errors
- Verify Telegram WebApp SDK is loaded

### Large bundle size warning
- Build still works! This is just a warning
- Use dynamic imports for heavy components if needed

---

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for Ethiopian Students**
