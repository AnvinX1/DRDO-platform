import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  FileText, 
  Building2, 
  Zap, 
  ArrowUp, 
  Database,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  BarChart3,
  Filter,
  RefreshCw,
  Bell,
  Eye,
  Download,
  Share2,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { db } from '../lib/database';
import { insertSampleData } from '../utils/sampleData';

interface DashboardStats {
  totalTechnologies: number;
  totalPatents: number;
  totalCompanies: number;
  totalPublications: number;
  emergingTech: number;
  matureTech: number;
  developingTech: number;
  decliningTech: number;
  averageTRL: number;
  highImpactPatents: number;
  activeDataSources: number;
  lastUpdate: string;
}

interface RecentActivity {
  id: string;
  type: 'patent' | 'publication' | 'company' | 'technology';
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'updated' | 'alert';
}

interface TechnologyTrend {
  name: string;
  domain: string;
  trl: number;
  growth: number;
  patents: number;
  publications: number;
  companies: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTechnologies: 0,
    totalPatents: 0,
    totalCompanies: 0,
    totalPublications: 0,
    emergingTech: 0,
    matureTech: 0,
    developingTech: 0,
    decliningTech: 0,
    averageTRL: 0,
    highImpactPatents: 0,
    activeDataSources: 0,
    lastUpdate: new Date().toISOString()
  });
  
  const [recentTechnologies, setRecentTechnologies] = useState<TechnologyTrend[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSampleData, setLoadingSampleData] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedDomain, setSelectedDomain] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange, selectedDomain]);

  const loadDashboardData = async () => {
    try {
      const [techCount, patentCount, companyCount, pubCount, emerging, mature, developing, declining] = await Promise.all([
        db.getTechnologyCount(),
        db.getPatentCount(),
        db.getCompanyCount(),
        db.getPublicationCount(),
        db.getTechnologyCount({ status: 'emerging' }),
        db.getTechnologyCount({ status: 'mature' }),
        db.getTechnologyCount({ status: 'developing' }),
        db.getTechnologyCount({ status: 'declining' })
      ]);

      // Calculate average TRL (simplified)
      const technologies = await db.getTechnologies();
      const averageTRL = technologies.length > 0 
        ? technologies.reduce((sum: number, tech: any) => sum + (tech.current_trl || 0), 0) / technologies.length 
        : 0;

      setStats({
        totalTechnologies: techCount,
        totalPatents: patentCount,
        totalCompanies: companyCount,
        totalPublications: pubCount,
        emergingTech: emerging,
        matureTech: mature,
        developingTech: developing,
        decliningTech: declining,
        averageTRL: Math.round(averageTRL * 10) / 10,
        highImpactPatents: Math.floor(patentCount * 0.15), // 15% are high impact
        activeDataSources: 8, // Mock data
        lastUpdate: new Date().toISOString()
      });

      // Load recent technologies with mock trend data
      const recentTechs = technologies.slice(0, 5).map((tech: any) => ({
        name: tech.name,
        domain: tech.domain,
        trl: tech.current_trl || 1,
        growth: Math.random() * 100 + 10,
        patents: Math.floor(Math.random() * 50) + 5,
        publications: Math.floor(Math.random() * 30) + 3,
        companies: Math.floor(Math.random() * 20) + 2
      }));
      setRecentTechnologies(recentTechs);

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'patent',
          title: 'New Patent Filed: Quantum Computing Error Correction',
          description: 'IBM filed a new patent for advanced quantum error correction methods',
          timestamp: '2 hours ago',
          status: 'new'
        },
        {
          id: '2',
          type: 'publication',
          title: 'Research Paper Published: AI in Defense Applications',
          description: 'New research on AI applications in defense systems published in Nature',
          timestamp: '4 hours ago',
          status: 'new'
        },
        {
          id: '3',
          type: 'company',
          title: 'Company Update: Tesla Defense Division',
          description: 'Tesla announced new investments in defense technology R&D',
          timestamp: '6 hours ago',
          status: 'updated'
        },
        {
          id: '4',
          type: 'technology',
          title: 'TRL Update: Hypersonic Weapons',
          description: 'Hypersonic weapons technology advanced to TRL 7',
          timestamp: '8 hours ago',
          status: 'alert'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleData = async () => {
    setLoadingSampleData(true);
    try {
      await insertSampleData();
      await loadDashboardData();
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoadingSampleData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-slate-600 bg-slate-100';
      case 'updated': return 'text-slate-600 bg-slate-100';
      case 'alert': return 'text-slate-700 bg-slate-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return CheckCircle;
      case 'updated': return RefreshCw;
      case 'alert': return AlertTriangle;
      default: return Clock;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patent': return FileText;
      case 'publication': return BookOpen;
      case 'company': return Building2;
      case 'technology': return Zap;
      default: return Activity;
    }
  };

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
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Technology intelligence overview</p>
          <p className="text-xs text-slate-400 mt-1">Monitor key metrics, track technology trends, and analyze market intelligence across all domains</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.totalTechnologies === 0 && (
            <button
              onClick={handleLoadSampleData}
              disabled={loadingSampleData}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 text-sm"
            >
              <Database className="w-4 h-4" />
              <span className="font-medium">
                {loadingSampleData ? 'Loading...' : 'Load Sample Data'}
              </span>
            </button>
          )}
          <button 
            onClick={loadDashboardData}
            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
          >
            <option value="all">All Domains</option>
            <option value="Defense & Aerospace">Defense & Aerospace</option>
            <option value="Computing & Information Technology">Computing & IT</option>
            <option value="Energy & Materials">Energy & Materials</option>
            <option value="Biotechnology">Biotechnology</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Updated {new Date(stats.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white rounded-lg border border-slate-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalTechnologies.toLocaleString()}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Technologies</p>
            <div className="mt-1 text-xs text-slate-400">
              Avg TRL: {stats.averageTRL}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg border border-slate-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalPatents.toLocaleString()}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Patents</p>
            <div className="mt-1 text-xs text-slate-400">
              {stats.highImpactPatents} high impact
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg border border-slate-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <Building2 className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+5%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalCompanies.toLocaleString()}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Companies</p>
            <div className="mt-1 text-xs text-slate-400">
              Active partnerships
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg border border-slate-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+18%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalPublications.toLocaleString()}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Publications</p>
            <div className="mt-1 text-xs text-slate-400">
              {stats.activeDataSources} sources
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technology Status Distribution */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Technology Status</h2>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                <Eye className="w-3 h-3 text-slate-400" />
              </button>
              <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                <Download className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Emerging</span>
                <span className="text-xs font-semibold text-slate-900">{stats.emergingTech}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-300 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalTechnologies ? (stats.emergingTech / stats.totalTechnologies) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Developing</span>
                <span className="text-xs font-semibold text-slate-900">{stats.developingTech}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalTechnologies ? (stats.developingTech / stats.totalTechnologies) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Mature</span>
                <span className="text-xs font-semibold text-slate-900">{stats.matureTech}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalTechnologies ? (stats.matureTech / stats.totalTechnologies) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Declining</span>
                <span className="text-xs font-semibold text-slate-900">{stats.decliningTech}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalTechnologies ? (stats.decliningTech / stats.totalTechnologies) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
              <Bell className="w-3 h-3 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status);
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
                  <ActivityIcon className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded ${getStatusColor(activity.status)}`}>
                        <StatusIcon className="w-2 h-2" />
                        {activity.status}
                      </span>
                      <span className="text-xs text-slate-400">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Trends */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Technology Trends</h2>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
              <BarChart3 className="w-3 h-3 text-slate-400" />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
              <Share2 className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentTechnologies.map((tech, index) => (
            <div key={index} className="p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-slate-900 text-xs">{tech.name}</h3>
                  <p className="text-xs text-slate-500">{tech.domain}</p>
                </div>
                <span className="inline-block px-1.5 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded">
                  TRL {tech.trl}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Growth</span>
                  <span className="font-medium text-slate-600">+{tech.growth.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Patents</span>
                  <span className="font-medium text-slate-900">{tech.patents}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Publications</span>
                  <span className="font-medium text-slate-900">{tech.publications}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Companies</span>
                  <span className="font-medium text-slate-900">{tech.companies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}