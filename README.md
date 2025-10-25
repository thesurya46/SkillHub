# SkillHub - Skill Exchange Platform

A modern, minimalistic skill-sharing platform where users can exchange skills, learn new technologies, and collaborate on projects. Built with React, TypeScript, Tailwind CSS, and Supabase.

![SkillHub](https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🎯 Features

### Core Functionality
- **User Authentication** - Secure email/password authentication with Supabase
- **Profile Management** - Create and customize your professional profile
- **Skill Marketplace** - Browse and exchange skills with other users
- **Credit System** - Earn and spend credits for skill exchanges
- **Social Feed** - Share updates, posts, and interact with the community
- **Direct Messaging** - Real-time communication between users
- **Project Collaboration** - Find collaborators for your projects
- **Booking System** - Schedule skill exchange sessions
- **Learning Modules** - Access comprehensive courses in Java, Python, HTML, CSS
- **AI Recommendations** - Get personalized skill match suggestions
- **Puzzle Games** - Engage with educational coding challenges
- **Notifications** - Stay updated with real-time notifications

### Accessibility Features
- **Voice Navigation** - Navigate the app using voice commands
- **Multi-language Support** - Available in English, Spanish, French, German, and Chinese
- **Screen Reader Compatible** - Full ARIA labels and semantic HTML
- **Keyboard Navigation** - Complete keyboard accessibility
- **Reduced Motion Support** - Respects user motion preferences

### Design
- **Minimalistic Black & White Theme** - Clean, professional aesthetic
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Subtle transitions and micro-interactions
- **Modern UI Components** - Built with Tailwind CSS
- **Accessible Design** - WCAG 2.1 compliant

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (database already configured)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd skillhub
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
skillhub/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.jsx         # Authentication forms
│   │   ├── Dashboard.jsx    # Main dashboard layout
│   │   ├── Profile.jsx      # User profile management
│   │   ├── ExploreSkills.jsx # Skill browsing and learning
│   │   ├── MySkills.jsx     # User's skills management
│   │   ├── Feed.jsx         # Social feed
│   │   ├── Posts.jsx        # Post creation and display
│   │   ├── Messages.jsx     # Direct messaging
│   │   ├── Projects.jsx     # Project collaboration
│   │   ├── Bookings.jsx     # Session scheduling
│   │   ├── Credits.jsx      # Credit management
│   │   ├── UserSearch.jsx   # User discovery
│   │   ├── Notifications.jsx # Notification center
│   │   ├── PuzzleGames.jsx  # Coding challenges
│   │   ├── AIRecommendations.jsx # AI matching
│   │   ├── SettingsPanel.jsx # Settings
│   │   └── AccessibilitySettings.tsx # Accessibility options
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── AccessibilityContext.tsx # Accessibility state
│   ├── hooks/               # Custom React hooks
│   │   ├── useActivityTracker.ts # Activity tracking
│   │   ├── useTranslation.ts # Internationalization
│   │   └── useVoiceCommands.ts # Voice navigation
│   ├── lib/                 # External services
│   │   ├── supabase.js      # Supabase client
│   │   └── translations.ts  # Translation strings
│   ├── utils/               # Utility functions
│   │   └── themeClasses.js  # Theme utilities
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge functions
│       ├── api-profiles/    # Profile API
│       ├── api-projects/    # Projects API
│       ├── api-skills/      # Skills API
│       └── ai-skill-matching/ # AI recommendations
├── public/                  # Static assets
├── dist/                    # Production build
└── package.json             # Dependencies

```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles with skills and credits
- **skills** - Available skills catalog
- **profile_skills** - User-skill relationships
- **user_skills_to_learn** - Skills users want to learn
- **bookings** - Skill exchange sessions
- **credit_transactions** - Credit transfer history
- **posts** - User-generated content
- **post_interactions** - Likes and comments
- **messages** - Direct messages between users
- **notifications** - User notifications
- **projects** - Collaboration projects
- **project_members** - Project team members

### Security
- Row Level Security (RLS) enabled on all tables
- Authentication-based access control
- Secure data isolation per user

## 🔌 API Endpoints

### Edge Functions
All Edge Functions are deployed on Supabase and handle:

- **api-profiles** - Profile CRUD operations
- **api-projects** - Project management
- **api-skills** - Skills catalog
- **ai-skill-matching** - AI-powered skill recommendations

### Authentication
Uses Supabase Auth with email/password:
- Sign Up
- Sign In
- Sign Out
- Session Management

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Text**: Gray-900 (#1a1a1a)
- **Secondary Text**: Gray-600 (#525252)
- **Borders**: Gray-200 (#e5e7eb)
- **Accents**: Gray-900 for buttons and highlights

### Typography
- **Font Family**: System fonts (Inter, SF Pro, Segoe UI)
- **Headings**: Bold, line-height 1.2
- **Body**: Regular, line-height 1.5

### Spacing
- Base unit: 4px (0.25rem)
- Consistent 8px spacing system

## 🧪 Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Edge Functions
  - Real-time subscriptions

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security

- Secure authentication with Supabase
- Row Level Security (RLS) policies
- Environment variables for sensitive data
- HTTPS only in production
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@skillhub.com or join our community Discord.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI Components inspired by modern design principles
- Icons by [Lucide](https://lucide.dev/)
- Database by [Supabase](https://supabase.com/)
- Images from [Pexels](https://www.pexels.com/)

---

**Made with ❤️ for the learning community**
