import { useEffect, useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Palette, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Key, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  ChevronDown,
  Zap,
  Activity,
  TrendingUp,
  FileText,
  Building2,
  Brain,
  Target
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  location: string;
  avatar: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      sound: boolean;
    };
    alerts: {
      patent: boolean;
      technology: boolean;
      market: boolean;
      system: boolean;
      security: boolean;
      forecast: boolean;
    };
    dashboard: {
      defaultView: string;
      refreshInterval: number;
      showMetrics: boolean;
      showCharts: boolean;
    };
  };
}

interface SystemSettings {
  dataRetention: {
    patents: number;
    technologies: number;
    forecasts: number;
    logs: number;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
  };
  integrations: {
    patentDatabases: string[];
    newsFeeds: string[];
    marketData: string[];
    aiModels: string[];
  };
  performance: {
    cacheEnabled: boolean;
    cacheSize: number;
    autoRefresh: boolean;
    backgroundSync: boolean;
  };
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['profile', 'notifications']));
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@drdo.gov.in',
    role: 'Technology Intelligence Analyst',
    department: 'Defense Research & Development',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    avatar: '',
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      notifications: {
        email: true,
        push: true,
        sms: false,
        sound: true
      },
      alerts: {
        patent: true,
        technology: true,
        market: true,
        system: true,
        security: true,
        forecast: true
      },
      dashboard: {
        defaultView: 'overview',
        refreshInterval: 30,
        showMetrics: true,
        showCharts: true
      }
    }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    dataRetention: {
      patents: 7,
      technologies: 5,
      forecasts: 3,
      logs: 1
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    integrations: {
      patentDatabases: ['USPTO', 'EPO', 'WIPO', 'Indian Patent Office'],
      newsFeeds: ['Defense News', 'Technology Review', 'Scientific American'],
      marketData: ['Bloomberg', 'Reuters', 'MarketWatch'],
      aiModels: ['GPT-4', 'Claude', 'Custom Neural Network']
    },
    performance: {
      cacheEnabled: true,
      cacheSize: 1024,
      autoRefresh: true,
      backgroundSync: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
  };

  const handleExportData = () => {
    const data = {
      userProfile,
      systemSettings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techintel-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.userProfile) setUserProfile(data.userProfile);
          if (data.systemSettings) setSystemSettings(data.systemSettings);
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
          <button
            onClick={() => toggleSection('profile')}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            {expandedSections.has('profile') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        
        {expandedSections.has('profile') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
              <input
                type="text"
                value={userProfile.role}
                onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <input
                type="text"
                value={userProfile.department}
                onChange={(e) => setUserProfile(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
          <button
            onClick={() => toggleSection('notifications')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {expandedSections.has('notifications') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
        
        {expandedSections.has('notifications') && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Delivery Methods</h4>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', icon: Mail },
                  { key: 'push', label: 'Push Notifications', icon: Bell },
                  { key: 'sms', label: 'SMS Alerts', icon: Phone },
                  { key: 'sound', label: 'Sound Alerts', icon: Volume2 }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700">{label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.notifications[key as keyof typeof userProfile.preferences.notifications]}
                        onChange={(e) => setUserProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              [key]: e.target.checked
                            }
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Alert Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'patent', label: 'Patent Alerts', icon: FileText, color: 'text-blue-600' },
                  { key: 'technology', label: 'Technology Updates', icon: Zap, color: 'text-cyan-600' },
                  { key: 'market', label: 'Market Changes', icon: TrendingUp, color: 'text-emerald-600' },
                  { key: 'system', label: 'System Alerts', icon: Activity, color: 'text-violet-600' },
                  { key: 'security', label: 'Security Alerts', icon: Shield, color: 'text-red-600' },
                  { key: 'forecast', label: 'Forecast Updates', icon: Brain, color: 'text-orange-600' }
                ].map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-slate-700">{label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.alerts[key as keyof typeof userProfile.preferences.alerts]}
                        onChange={(e) => setUserProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            alerts: {
                              ...prev.preferences.alerts,
                              [key]: e.target.checked
                            }
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Appearance & Theme</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'auto', label: 'Auto', icon: Monitor }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setUserProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: value as any }
                  }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userProfile.preferences.theme === value
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={userProfile.preferences.language}
                onChange={(e) => setUserProfile(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, language: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
              <select
                value={userProfile.preferences.timezone}
                onChange={(e) => setUserProfile(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, timezone: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Security Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.security.twoFactor}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, twoFactor: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={systemSettings.security.sessionTimeout}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={systemSettings.security.passwordExpiry}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Shield className="w-4 h-4" />
              <span>Security Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Data Management</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-4">Data Retention (years)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(systemSettings.dataRetention).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">{key}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      dataRetention: { ...prev.dataRetention, [key]: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">External Integrations</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-4">Patent Databases</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {systemSettings.integrations.patentDatabases.map((db, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">{db}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-4">News Feeds</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {systemSettings.integrations.newsFeeds.map((feed, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">{feed}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-4">AI Models</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {systemSettings.integrations.aiModels.map((model, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-slate-700">{model}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">System Configuration</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Auto Refresh</h4>
              <p className="text-sm text-slate-600">Automatically refresh data at regular intervals</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.performance.autoRefresh}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, autoRefresh: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Background Sync</h4>
              <p className="text-sm text-slate-600">Sync data in the background for better performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.performance.backgroundSync}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  performance: { ...prev.performance, backgroundSync: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cache Size (MB)</label>
            <input
              type="number"
              value={systemSettings.performance.cacheSize}
              onChange={(e) => setSystemSettings(prev => ({
                ...prev,
                performance: { ...prev.performance, cacheSize: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'security': return renderSecuritySettings();
      case 'data': return renderDataSettings();
      case 'integrations': return renderIntegrationsSettings();
      case 'system': return renderSystemSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account preferences and system configuration</p>
          <p className="text-xs text-slate-400 mt-1">Configure user preferences, notification settings, security options, data management, and system integrations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 text-sm"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="font-medium">Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex flex-wrap border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === tab.id
                    ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
