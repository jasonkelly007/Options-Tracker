import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Positions from './pages/Positions';
import AddPosition from './pages/AddPosition';
import Options from './pages/Options';
import AddCoveredCall from './pages/AddCoveredCall';
import AddCashSecuredPut from './pages/AddCashSecuredPut';
import AddOption from './pages/AddOption';
import Import from './pages/Import';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('app_password'));

  const handleLogin = (password: string) => {
    localStorage.setItem('app_password', password);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <Router>
      <div className="min-h-screen pb-20 md:pb-0 bg-slate-50">
        {/* Top Navbar - Desktop Only */}
        <nav className="hidden md:block bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Options Tracker
                  </span>
                </Link>
                <div className="ml-10 flex space-x-4">
                  <NavLink to="/">Dashboard</NavLink>
                  <NavLink to="/positions">Positions</NavLink>
                  <NavLink to="/options">Options</NavLink>
                  <NavLink to="/import">Import</NavLink>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('app_password');
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around h-20 px-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <BottomNavItem to="/" icon={<HomeIcon />} label="Home" />
          <BottomNavItem to="/positions" icon={<StockIcon />} label="Stocks" />
          <BottomNavItem to="/options" icon={<OptionIcon />} label="Options" />
          <BottomNavItem to="/import" icon={<ImportIcon />} label="Import" />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/positions/new" element={<AddPosition />} />
            <Route path="/options" element={<Options />} />
            <Route path="/options/new" element={<AddOption />} />
            <Route path="/covered-calls/new" element={<AddCoveredCall />} />
            <Route path="/cash-secured-puts/new" element={<AddCashSecuredPut />} />
            <Route path="/import" element={<Import />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const StockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const OptionIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ImportIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

interface BottomNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function BottomNavItem({ to, icon, label }: BottomNavItemProps) {
  return (
    <Link to={to} className="flex flex-col items-center justify-center space-y-1 w-full py-2 group">
      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 uppercase tracking-tighter">
        {label}
      </span>
    </Link>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
    >
      {children}
    </Link>
  );
}

export default App;
