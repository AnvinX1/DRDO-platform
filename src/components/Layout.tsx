import { Database, TrendingUp, FileText, Building2, Bell, Settings, BarChart3, Zap } from 'lucide-react';
import Dock from './Dock';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
}

export default function Layout({ children, onNavigate }: LayoutProps) {
  const dockItems = [
    { icon: <BarChart3 size={16} />, label: 'Dashboard', onClick: () => onNavigate?.('dashboard') },
    { icon: <Zap size={16} />, label: 'Technologies', onClick: () => onNavigate?.('technologies') },
    { icon: <FileText size={16} />, label: 'Patents', onClick: () => onNavigate?.('patents') },
    { icon: <Building2 size={16} />, label: 'Companies', onClick: () => onNavigate?.('companies') },
    { icon: <TrendingUp size={16} />, label: 'Forecasting', onClick: () => onNavigate?.('forecasting') },
    { icon: <Database size={16} />, label: 'Data Sources', onClick: () => onNavigate?.('data-sources') },
    { icon: <Bell size={16} />, label: 'Alerts', onClick: () => onNavigate?.('alerts') },
    { icon: <Settings size={16} />, label: 'Settings', onClick: () => onNavigate?.('settings') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">TechIntel</h1>
              <p className="text-xs text-slate-400">DRDO Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            </div>
            <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {children}
      </main>

      {/* Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            panelHeight={56}
            baseItemSize={40}
            magnification={70}
          />
        </div>
      </div>
    </div>
  );
}
