import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Loading Urban Skill Exchange...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
