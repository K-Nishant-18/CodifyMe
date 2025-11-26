import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import RoadmapView from './components/RoadmapView';
import InterviewSimulator from './components/InterviewSimulator';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import CompanyIntelligence from './components/CompanyIntelligence';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const handleOnboardingComplete = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showNav = location.pathname !== '/' && location.pathname !== '/onboarding' && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-neo-bg font-mono text-neo-dark">
      {showNav && (
        <nav className="bg-white border-b-4 border-black p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="text-2xl font-black uppercase tracking-tighter cursor-pointer" onClick={() => navigate('/dashboard')}>
            CodifyMe
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard">
              <button
                className={`px-4 py-2 font-bold border-2 border-black transition-all ${location.pathname === '/dashboard' ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
              >
                Dashboard
              </button>
            </Link>
            <Link to="/roadmap">
              <button
                className={`px-4 py-2 font-bold border-2 border-black transition-all ${location.pathname === '/roadmap' ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
              >
                Roadmap
              </button>
            </Link>
            <Link to="/interview">
              <button
                className={`px-4 py-2 font-bold border-2 border-black transition-all ${location.pathname === '/interview' ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
              >
                Interview
              </button>
            </Link>
            <Link to="/companies">
              <button
                className={`px-4 py-2 font-bold border-2 border-black transition-all ${location.pathname === '/companies' ? 'bg-neo-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
              >
                Companies
              </button>
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-bold border-2 border-black bg-red-400 hover:bg-red-500 transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap/:id"
            element={
              <ProtectedRoute>
                <RoadmapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <CompanyIntelligence />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
