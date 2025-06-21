import {
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  EyeOff,
  Globe,
  Key,
  Lock,
  Mail,
  Save,
  Server,
  Settings,
  Shield,
  Smartphone,
  User,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import AnimatedNumber from './AnimatedNumber';
import { motion } from 'framer-motion';
import { useLiquidGlass } from './SimpleLiquidGlass';

const Configuration = () => {
  const [activeSection, setActiveSection] = useState('api');
  const [showPasswords, setShowPasswords] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    api: true,
    wattson: false,
    notifications: false,
    security: false
  });

  // Configuration states
  const [config, setConfig] = useState({
    // MARA API Configuration
    apiUrl: 'https://api.marathondh.com/v1',
    apiKey: '••••••••••••••••••••••••••••••••',
    refreshInterval: 30,
    timeout: 10000,
    retryAttempts: 3,
    siteName: 'HackFestSite',
    sitePower: 1000000,
    
    // Wattson AI Configuration
    wattsonPersonality: 'sherlock',
    wattsonVerbosity: 'detailed',
    wattsonConfidenceThreshold: 75,
    wattsonAutoExecute: false,
    wattsonLearningMode: true,
    wattsonVoiceEnabled: true,
    
    // Notification Preferences
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emergencyAlerts: true,
    profitAlerts: true,
    maintenanceAlerts: true,
    marketAlerts: false,
    dailyReports: true,
    weeklyReports: true,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 60,
    ipWhitelist: ['192.168.1.0/24'],
    encryptionLevel: 'AES-256',
    auditLogging: true,
    secureBackups: true
  });

  // Liquid glass containers
  const heroRef = useLiquidGlass({ width: 1200, height: 200 });
  const configRef = useLiquidGlass({ width: 800, height: 600 });
  const sidebarRef = useLiquidGlass({ width: 300, height: 500 });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleConfigChange = (category, field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfiguration = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success notification
    }, 2000);
  };

  const handleCreateSite = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.siteName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Auto-populate the configuration with the returned values
      setConfig(prev => ({
        ...prev,
        apiKey: result.data.api_key,
        sitePower: result.data.power
      }));

      // Show success notification
      console.log('Site created successfully:', result.data);
    } catch (error) {
      console.error('Error creating site:', error);
      // Show error notification
    } finally {
      setIsSaving(false);
    }
  };

  const configSections = [
    {
      id: 'api',
      title: 'MARA API',
      icon: <Server className="w-5 h-5" />,
      description: 'Mining operations data connection'
    },
    {
      id: 'wattson',
      title: 'Wattson AI',
      icon: <Brain className="w-5 h-5" />,
      description: 'AI assistant behavior settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Alert and communication preferences'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield className="w-5 h-5" />,
      description: 'Access control and encryption'
    }
  ];

  const renderApiConfiguration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">API Endpoint</label>
          <input
            type="text"
            value={config.apiUrl}
            onChange={(e) => handleConfigChange('api', 'apiUrl', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">API Key</label>
          <div className="relative">
            <input
              type={showPasswords.apiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleConfigChange('api', 'apiKey', e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 pr-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
            />
            <button
              onClick={() => togglePasswordVisibility('apiKey')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPasswords.apiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Site Name</label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => handleConfigChange('api', 'siteName', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleCreateSite}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all backdrop-blur-sm shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white font-medium">Creating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Create Site</span>
              </>
            )}
          </motion.button>
          
          {config.sitePower > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Power: {config.sitePower.toLocaleString()} W
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Refresh Interval (seconds)</label>
            <input
              type="number"
              value={config.refreshInterval}
              onChange={(e) => handleConfigChange('api', 'refreshInterval', parseInt(e.target.value))}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-3">Timeout (ms)</label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) => handleConfigChange('api', 'timeout', parseInt(e.target.value))}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h4 className="text-emerald-400 font-medium">Connection Status</h4>
              <p className="text-emerald-400/80 text-sm">Connected to MARA API - Last sync 2 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderWattsonConfiguration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Personality Mode</label>
          <select
            value={config.wattsonPersonality}
            onChange={(e) => handleConfigChange('wattson', 'wattsonPersonality', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          >
            <option value="sherlock">Sherlock Holmes - Analytical & Deductive</option>
            <option value="professional">Professional - Direct & Efficient</option>
            <option value="friendly">Friendly - Conversational & Supportive</option>
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Response Detail Level</label>
          <select
            value={config.wattsonVerbosity}
            onChange={(e) => handleConfigChange('wattson', 'wattsonVerbosity', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          >
            <option value="brief">Brief - Key insights only</option>
            <option value="detailed">Detailed - Full analysis</option>
            <option value="comprehensive">Comprehensive - Deep analysis with context</option>
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Confidence Threshold (%)</label>
          <div className="space-y-3">
            <input
              type="range"
              min="50"
              max="95"
              value={config.wattsonConfidenceThreshold}
              onChange={(e) => handleConfigChange('wattson', 'wattsonConfidenceThreshold', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-white/60">
              <span>50% - Show all recommendations</span>
              <AnimatedNumber 
                value={config.wattsonConfidenceThreshold} 
                suffix="%" 
                decimals={0}
                fontSize="text-sm"
                color="text-orange-400"
              />
              <span>95% - Only high confidence</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Auto-Execute Recommendations</h4>
              <p className="text-white/60 text-sm">Allow Wattson to execute low-risk optimizations automatically</p>
            </div>
            <button
              onClick={() => handleConfigChange('wattson', 'wattsonAutoExecute', !config.wattsonAutoExecute)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.wattsonAutoExecute ? 'bg-orange-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config.wattsonAutoExecute ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Learning Mode</h4>
              <p className="text-white/60 text-sm">Improve recommendations based on your feedback</p>
            </div>
            <button
              onClick={() => handleConfigChange('wattson', 'wattsonLearningMode', !config.wattsonLearningMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.wattsonLearningMode ? 'bg-orange-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config.wattsonLearningMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium">Voice Input</h4>
              <p className="text-white/60 text-sm">Enable voice commands and responses</p>
            </div>
            <button
              onClick={() => handleConfigChange('wattson', 'wattsonVoiceEnabled', !config.wattsonVoiceEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.wattsonVoiceEnabled ? 'bg-orange-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config.wattsonVoiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationConfiguration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', title: 'Email Notifications', icon: <Mail className="w-5 h-5" />, description: 'Receive alerts via email' },
          { key: 'smsNotifications', title: 'SMS Notifications', icon: <Smartphone className="w-5 h-5" />, description: 'Receive alerts via text message' },
          { key: 'pushNotifications', title: 'Push Notifications', icon: <Bell className="w-5 h-5" />, description: 'Browser push notifications' },
          { key: 'emergencyAlerts', title: 'Emergency Alerts', icon: <AlertTriangle className="w-5 h-5" />, description: 'Critical system failures' },
          { key: 'profitAlerts', title: 'Profit Alerts', icon: <Zap className="w-5 h-5" />, description: 'Profitability threshold changes' },
          { key: 'maintenanceAlerts', title: 'Maintenance Alerts', icon: <Settings className="w-5 h-5" />, description: 'Equipment maintenance schedules' },
          { key: 'marketAlerts', title: 'Market Alerts', icon: <Globe className="w-5 h-5" />, description: 'Energy and hash price changes' },
          { key: 'dailyReports', title: 'Daily Reports', icon: <Database className="w-5 h-5" />, description: 'Daily performance summaries' },
          { key: 'weeklyReports', title: 'Weekly Reports', icon: <Database className="w-5 h-5" />, description: 'Weekly analytics reports' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="text-orange-400">{item.icon}</div>
              <div>
                <h4 className="text-white font-medium">{item.title}</h4>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleConfigChange('notifications', item.key, !config[item.key])}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config[item.key] ? 'bg-orange-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config[item.key] ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSecurityConfiguration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-white/60 text-sm">Additional security layer for login</p>
              </div>
            </div>
            <button
              onClick={() => handleConfigChange('security', 'twoFactorAuth', !config.twoFactorAuth)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.twoFactorAuth ? 'bg-emerald-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center space-x-4">
              <Lock className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="text-white font-medium">Audit Logging</h4>
                <p className="text-white/60 text-sm">Track all system access and changes</p>
              </div>
            </div>
            <button
              onClick={() => handleConfigChange('security', 'auditLogging', !config.auditLogging)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.auditLogging ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                config.auditLogging ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Session Timeout (minutes)</label>
          <input
            type="number"
            value={config.sessionTimeout}
            onChange={(e) => handleConfigChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Encryption Level</label>
          <select
            value={config.encryptionLevel}
            onChange={(e) => handleConfigChange('security', 'encryptionLevel', e.target.value)}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 backdrop-blur-sm"
          >
            <option value="AES-128">AES-128 - Standard</option>
            <option value="AES-256">AES-256 - High Security</option>
            <option value="AES-256-GCM">AES-256-GCM - Maximum Security</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderConfigurationContent = () => {
    switch (activeSection) {
      case 'api': return renderApiConfiguration();
      case 'wattson': return renderWattsonConfiguration();
      case 'notifications': return renderNotificationConfiguration();
      case 'security': return renderSecurityConfiguration();
      default: return renderApiConfiguration();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Ambient Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header with Save Button */}
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 rounded-3xl p-8 bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-2xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extralight text-white tracking-tight">Configuration</h1>
                <p className="text-lg text-white/60 font-light">System Settings & Preferences</p>
              </div>
            </div>
            
            <motion.button
              onClick={handleSaveConfiguration}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all backdrop-blur-sm shadow-lg"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white font-medium">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Save Configuration</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Main Configuration Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configuration Sidebar */}
          <motion.div 
            ref={sidebarRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 h-fit"
          >
            <h3 className="text-lg font-light text-white mb-6">Settings Categories</h3>
            
            <div className="space-y-2">
              {configSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all text-left ${
                    activeSection === section.id
                      ? 'bg-orange-500/20 border border-orange-500/30 text-white'
                      : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  <div className={`${activeSection === section.id ? 'text-orange-400' : 'text-white/60'}`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs opacity-70">{section.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Configuration Content */}
          <div className="lg:col-span-3">
            <motion.div 
              ref={configRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-light text-white mb-2">
                  {configSections.find(s => s.id === activeSection)?.title}
                </h2>
                <p className="text-white/60">
                  {configSections.find(s => s.id === activeSection)?.description}
                </p>
              </div>

              {renderConfigurationContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;