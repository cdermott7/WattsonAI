import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import PremiumHomepage from './components/PremiumHomepage';
import PremiumDashboard from './components/PremiumDashboard';
import PremiumExecutionPage from './components/PremiumExecutionPage';
import CommandCenter from './components/CommandCenter';
import Configuration from './components/Configuration';
import PremiumChatWidget from './components/PremiumChatWidget';
import ApiTest from './components/ApiTest';
import { Home, BarChart3, Play, Brain, Activity, Command, Settings } from 'lucide-react';
import './App.css';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview', icon: Home },
    { path: '/dashboard', label: 'Analytics', icon: BarChart3 },
    { path: '/execution', label: 'Execution', icon: Play },
    { path: '/command', label: 'Command', icon: Command },
    { path: '/config', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="relative bg-black/60 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extralight text-white tracking-tight">Wattson</span>
              <div className="text-xs text-white/60 font-light">Enterprise Operations AI</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 z-10">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            
            {/* Status Indicator */}
            <div className="ml-4 flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/80">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <Navigation />

        {/* Main Content */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<PremiumHomepage />} />
            <Route path="/dashboard" element={<PremiumDashboard />} />
            <Route path="/execution" element={<PremiumExecutionPage />} />
            <Route path="/command" element={<CommandCenter />} />
            <Route path="/config" element={<Configuration />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </main>

        {/* Premium Chat Widget */}
        <PremiumChatWidget />
      </div>
    </Router>
  );
}

export default App;