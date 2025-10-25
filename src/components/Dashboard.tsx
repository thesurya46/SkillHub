import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { useTranslation } from '../hooks/useTranslation';
import { Profile } from './Profile';
import { SkillsExplorer } from './SkillsExplorer';
import { MySkills } from './MySkills';
import { Bookings } from './Bookings';
import { CommunityProjects } from './CommunityProjects';
import { Credits } from './Credits';
import { AccessibilitySettings } from './AccessibilitySettings';
import {
  LogOut,
  User,
  Search,
  BookOpen,
  Calendar,
  Users,
  Coins,
  Menu,
  X,
  Settings,
} from 'lucide-react';

type Tab = 'explore' | 'myskills' | 'bookings' | 'projects' | 'credits' | 'profile' | 'settings';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const { speak } = useAccessibility();
  const { t } = useTranslation();

  useVoiceCommands((command) => {
    if (command.startsWith('search:')) {
      setActiveTab('explore');
    } else if (command === 'profile') {
      setActiveTab('profile');
    } else if (command === 'myskills') {
      setActiveTab('myskills');
    } else if (command === 'bookings') {
      setActiveTab('bookings');
    } else if (command === 'projects') {
      setActiveTab('projects');
    } else if (command === 'credits') {
      setActiveTab('credits');
    } else if (command === 'settings') {
      setActiveTab('settings');
    } else if (command === 'explore') {
      setActiveTab('explore');
    }
  });

  const tabs = [
    { id: 'explore' as Tab, label: t('explore'), icon: Search },
    { id: 'myskills' as Tab, label: t('mySkills'), icon: BookOpen },
    { id: 'bookings' as Tab, label: t('bookings'), icon: Calendar },
    { id: 'projects' as Tab, label: t('community'), icon: Users },
    { id: 'credits' as Tab, label: t('credits'), icon: Coins },
    { id: 'profile' as Tab, label: t('profile'), icon: User },
    { id: 'settings' as Tab, label: t('settings'), icon: Settings },
  ];

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    const tabLabel = tabs.find((t) => t.id === tabId)?.label;
    if (tabLabel) {
      speak(`Opening ${tabLabel}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <SkillsExplorer />;
      case 'myskills':
        return <MySkills />;
      case 'bookings':
        return <Bookings />;
      case 'projects':
        return <CommunityProjects />;
      case 'credits':
        return <Credits />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <AccessibilitySettings />;
      default:
        return <SkillsExplorer />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-600">{t('appName')}</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>
            {profile && (
              <div className="mt-4">
                <p className="font-medium text-gray-900">{profile.full_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Coins size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">
                    {profile.credits} {t('credits').toLowerCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={`Go to ${tab.label}`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={20} />
              <span className="font-medium">{t('signOut')}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">{renderContent()}</div>
      </main>
    </div>
  );
};
