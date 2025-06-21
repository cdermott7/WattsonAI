import './App.css';

import { Activity, BarChart3, Brain, Command, Home, Play, Settings } from 'lucide-react';
import { NavLink, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import ApiTest from './components/ApiTest';
import CommandCenter from './components/CommandCenter';
import Configuration from './components/Configuration';
import { DataProvider } from './context/DataContext';
import DataStatusIndicator from './components/DataStatusIndicator';
import PremiumChatWidget from './components/PremiumChatWidget';
import PremiumDashboard from './components/PremiumDashboard';
import PremiumExecutionPage from './components/PremiumExecutionPage';
import PremiumHomepage from './components/PremiumHomepage';
import React from 'react';

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
            <img src="/logo.png" alt="Wattson AI Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-white">Wattson</h1>
              <p className="text-xs text-white/70">Enterprise Operations AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 z-10">
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
            
            {/* Data Status Indicator */}
            <DataStatusIndicator />
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <DataProvider>
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
    </DataProvider>
  );
}

export default App;