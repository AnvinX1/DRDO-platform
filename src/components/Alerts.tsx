import { useEffect, useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  RefreshCw,
  Eye,
  Archive,
  Trash2,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Zap,
  Shield,
  Activity,
  Calendar,
  Volume2,
  VolumeX,
  ChevronDown,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'patent' | 'technology' | 'market' | 'system' | 'security' | 'forecast';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  starred: boolean;
  source: string;
  action_required: boolean;
  metadata?: {
    technology_id?: string;
    patent_id?: string;
    company_id?: string;
    forecast_id?: string;
    confidence_score?: number;
    impact_level?: string;
  };
}

interface AlertStats {
  total: number;
  unread: number;
  critical: number;
  today: number;
  thisWeek: number;
  actionRequired: number;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    unread: 0,
    critical: 0,
    today: 0,
    thisWeek: 0,
    actionRequired: 0
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      // Generate mock alert data
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const total = mockAlerts.length;
      const unread = mockAlerts.filter(a => !a.read).length;
      const critical = mockAlerts.filter(a => a.priority === 'critical').length;
      const todayCount = mockAlerts.filter(a => new Date(a.timestamp) >= today).length;
      const thisWeekCount = mockAlerts.filter(a => new Date(a.timestamp) >= weekAgo).length;
      const actionRequired = mockAlerts.filter(a => a.action_required).length;
      
      setStats({
        total,
        unread,
        critical,
        today: todayCount,
        thisWeek: thisWeekCount,
        actionRequired
      });
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAlerts = (): Alert[] => {
    const alertTypes = ['patent', 'technology', 'market', 'system', 'security', 'forecast'] as const;
    const priorities = ['low', 'medium', 'high', 'critical'] as const;
    const sources = ['Patent Database', 'Technology Monitor', 'Market Analysis', 'System Monitor', 'Security Scanner', 'AI Forecast Engine'];
    
    const alertTemplates = [
      {
        patent: [
          { title: 'New Patent Filed: Quantum Computing Error Correction', description: 'IBM filed a new patent for advanced quantum error correction methods that could impact our technology roadmap.' },
          { title: 'Patent Expiration Alert: Neural Network Architecture', description: 'Key patent in neural network architecture will expire in 6 months. Consider filing continuation or new applications.' },
          { title: 'Patent Opposition Filed: AI Defense Systems', description: 'Competitor has filed opposition to our AI defense systems patent. Legal review required.' }
        ],
        technology: [
          { title: 'TRL Advancement: Hypersonic Weapons', description: 'Hypersonic weapons technology has advanced to TRL 7. Consider updating strategic planning.' },
          { title: 'Technology Risk Alert: Quantum Encryption', description: 'Quantum encryption technology showing signs of vulnerability. Security review recommended.' },
          { title: 'Breakthrough Alert: Fusion Energy', description: 'Major breakthrough in fusion energy reported. Potential impact on energy sector forecasts.' }
        ],
        market: [
          { title: 'Market Shift: Defense AI Spending', description: 'Defense AI spending increased 25% this quarter. Market opportunity analysis updated.' },
          { title: 'Competitor Alert: Tesla Defense Division', description: 'Tesla announced $2B investment in defense technology R&D. Competitive analysis required.' },
          { title: 'Market Forecast Update: Space Technology', description: 'Space technology market forecast revised upward by 15%. Investment recommendations updated.' }
        ],
        system: [
          { title: 'System Performance Alert', description: 'Database query performance degraded by 30%. Optimization required.' },
          { title: 'Data Sync Issue: Patent Database', description: 'Patent database sync failed for 3 hours. Manual intervention required.' },
          { title: 'Backup System Alert', description: 'Automated backup system failed. Manual backup initiated.' }
        ],
        security: [
          { title: 'Security Scan Alert', description: 'Unusual access patterns detected from external IP. Security review in progress.' },
          { title: 'Data Breach Attempt', description: 'Multiple failed login attempts detected. Account locked for security.' },
          { title: 'Vulnerability Scan Complete', description: 'Security vulnerability scan completed. 2 medium-risk issues found.' }
        ],
        forecast: [
          { title: 'Forecast Confidence Drop', description: 'AI forecast confidence for quantum computing dropped below 70%. Model retraining recommended.' },
          { title: 'New Forecast Available', description: 'Updated market size forecast for autonomous vehicles now available.' },
          { title: 'Forecast Model Update', description: 'Neural network model updated with latest data. Previous forecasts may need review.' }
        ]
      }
    ];

    const alerts: Alert[] = [];
    const now = new Date();
    
    for (let i = 0; i < 25; i++) {
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const template = alertTemplates[0][type][Math.floor(Math.random() * alertTemplates[0][type].length)];
      const hoursAgo = Math.floor(Math.random() * 72); // Last 3 days
      const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      
      alerts.push({
        id: `alert-${i}`,
        type,
        priority,
        title: template.title,
        description: template.description,
        timestamp: timestamp.toISOString(),
        read: Math.random() > 0.4,
        archived: Math.random() > 0.9,
        starred: Math.random() > 0.8,
        source: sources[Math.floor(Math.random() * sources.length)],
        action_required: Math.random() > 0.6,
        metadata: {
          confidence_score: type === 'forecast' ? 0.6 + Math.random() * 0.4 : undefined,
          impact_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        }
      });
    }
    
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      patent: FileText,
      technology: Zap,
      market: TrendingUp,
      system: Activity,
      security: Shield,
      forecast: Bell
    };
    return icons[type] || Bell;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      patent: 'bg-slate-100 text-slate-700',
      technology: 'bg-slate-100 text-slate-700',
      market: 'bg-slate-100 text-slate-700',
      system: 'bg-slate-100 text-slate-700',
      security: 'bg-slate-100 text-slate-700',
      forecast: 'bg-slate-100 text-slate-700'
    };
    return colors[type] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-slate-500',
      medium: 'text-slate-600',
      high: 'text-slate-700',
      critical: 'text-slate-900 font-semibold'
    };
    return colors[priority] || 'text-slate-600';
  };

  const getPriorityIndicator = (priority: string) => {
    const indicators: Record<string, string> = {
      low: 'w-1 h-1 bg-slate-300 rounded-full',
      medium: 'w-1.5 h-1.5 bg-slate-400 rounded-full',
      high: 'w-2 h-2 bg-slate-500 rounded-full',
      critical: 'w-2 h-2 bg-slate-900 rounded-full'
    };
    return indicators[priority] || 'w-1 h-1 bg-slate-300 rounded-full';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAsUnread = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: false } : alert
    ));
  };

  const toggleStar = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, starred: !alert.starred } : alert
    ));
  };

  const archiveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, archived: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = selectedType === 'all' || alert.type === selectedType;
    const priorityMatch = selectedPriority === 'all' || alert.priority === selectedPriority;
    const statusMatch = selectedStatus === 'all' || 
      (selectedStatus === 'unread' && !alert.read) ||
      (selectedStatus === 'read' && alert.read) ||
      (selectedStatus === 'starred' && alert.starred) ||
      (selectedStatus === 'archived' && alert.archived);
    const searchMatch = searchQuery === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && priorityMatch && statusMatch && searchMatch && !alert.archived;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">System notifications and monitoring</p>
          <p className="text-xs text-slate-400 mt-1">Stay informed about critical developments, patent filings, technology breakthroughs, and market changes with intelligent alerting system</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-2 rounded-lg transition-all ${
              notificationsEnabled 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            {notificationsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button 
            onClick={loadAlerts}
            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
            </div>
            <Bell className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.unread}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Unread</p>
            </div>
            <Eye className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.critical}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Critical</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.today}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Today</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.thisWeek}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">This Week</p>
            </div>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats.actionRequired}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Action</p>
            </div>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="patent">Patent</option>
              <option value="technology">Technology</option>
              <option value="market">Market</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="forecast">Forecast</option>
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
            >
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="starred">Starred</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const Icon = getTypeIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-lg border transition-all hover:border-slate-300 ${
                  alert.read ? 'border-slate-200' : 'border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityIndicator(alert.priority)}`}></div>
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-medium ${alert.read ? 'text-slate-600' : 'text-slate-900'}`}>
                            {alert.title}
                          </h3>
                          {alert.starred && (
                            <Star className="w-3 h-3 text-slate-400 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          {alert.action_required && (
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              Action
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{alert.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{formatTimestamp(alert.timestamp)}</span>
                          <span>•</span>
                          <span>{alert.source}</span>
                          {alert.metadata?.confidence_score && (
                            <>
                              <span>•</span>
                              <span>{Math.round(alert.metadata.confidence_score * 100)}%</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alert.read ? markAsUnread(alert.id) : markAsRead(alert.id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title={alert.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            {alert.read ? <Eye className="w-3 h-3 text-slate-400" /> : <CheckCircle className="w-3 h-3 text-slate-400" />}
                          </button>
                          <button
                            onClick={() => toggleStar(alert.id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title={alert.starred ? 'Remove star' : 'Add star'}
                          >
                            <Star className={`w-3 h-3 ${alert.starred ? 'text-slate-400 fill-current' : 'text-slate-300'}`} />
                          </button>
                          <button
                            onClick={() => archiveAlert(alert.id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-3 h-3 text-slate-400" />
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">No alerts found</h3>
            <p className="text-xs text-slate-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'You\'re all caught up! No new alerts.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
