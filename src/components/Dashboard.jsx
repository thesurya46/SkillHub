import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useActivityTracker } from '../hooks/useActivityTracker';
import {
  Home,
  Search,
  BookOpen,
  Calendar,
  Users as UsersIcon,
  Coins,
  User,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Sparkles,
  Puzzle,
  UserSearch as UserSearchIcon,
} from 'lucide-react';

import Feed from './Feed';
import ExploreSkills from './ExploreSkills';
import MySkills from './MySkills';
import Bookings from './Bookings';
import Projects from './Projects';
import Credits from './Credits';
import Profile from './Profile';
import Notifications from './Notifications';
import Messages from './Messages';
import SettingsPanel from './SettingsPanel';
import Posts from './Posts';
import AIRecommendations from './AIRecommendations';
import PuzzleGames from './PuzzleGames';
import UserSearch from './UserSearch';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const { speak } = useAccessibility();

  useActivityTracker();

  useVoiceCommands((command) => {
    if (command === 'profile') setActiveTab('profile');
    else if (command === 'myskills') setActiveTab('myskills');
    else if (command === 'bookings') setActiveTab('bookings');
    else if (command === 'projects') setActiveTab('projects');
    else if (command === 'credits') setActiveTab('credits');
    else if (command === 'settings') setActiveTab('settings');
    else if (command === 'explore') setActiveTab('explore');
  });

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'user-search', label: 'Find People', icon: UserSearchIcon },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'explore', label: 'Explore Skills', icon: Search },
    { id: 'myskills', label: 'My Skills', icon: BookOpen },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: UsersIcon },
    { id: 'credits', label: 'Credits', icon: Coins },
    { id: 'puzzle-games', label: 'Puzzle Games', icon: Puzzle },
    { id: 'messages', label: 'My Connections', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    const tab = navItems.find((t) => t.id === tabId);
    if (tab) speak(`Opening ${tab.label}`);
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'feed':
          return <Feed onNavigate={handleTabChange} />;
        case 'user-search':
          return <UserSearch onNavigateToMessages={() => handleTabChange('messages')} />;
        case 'posts':
          return <Posts />;
        case 'ai-recommendations':
          return <AIRecommendations />;
        case 'explore':
          return <ExploreSkills />;
        case 'myskills':
          return <MySkills />;
        case 'bookings':
          return <Bookings />;
        case 'projects':
          return <Projects />;
        case 'credits':
          return <Credits />;
        case 'puzzle-games':
          return <PuzzleGames />;
        case 'profile':
          return <Profile />;
        case 'notifications':
          return <Notifications />;
        case 'messages':
          return <Messages />;
        case 'settings':
          return <SettingsPanel />;
        default:
          return <Feed />;
      }
    })();

    return (
      <div key={activeTab} className="fade-in">
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">SkillHub</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {profile && (
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => handleTabChange('profile')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{profile.full_name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Coins size={14} />
                    <span>{profile.credits} credits</span>
                  </div>
                </div>
              </button>
            </div>
          )}

          <nav className="flex-1 p-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                    activeTab === item.id
                      ? 'bg-gray-900 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => handleTabChange('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors border border-red-200"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {navItems.find((t) => t.id === activeTab)?.label || 'Feed'}
            </h2>
          </div>
        </header>

        <div className="p-4 lg:p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
