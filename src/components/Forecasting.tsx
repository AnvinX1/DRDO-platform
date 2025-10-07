import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Target, 
  Calendar,
  Filter,
  Download,
  Share2,
  Eye,
  RefreshCw,
  Zap,
  Brain,
  LineChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { db, type Forecast, type Technology } from '../lib/database';

interface ForecastWithTech extends Forecast {
  technology?: Technology;
}

interface ForecastData {
  trl_progression: {
    projections: Array<{
      year: number;
      trl: number;
      confidence: number;
    }>;
  };
  market_size: {
    projections: Array<{
      year: number;
      market_size_usd: number;
      growth_rate: number;
    }>;
  };
  adoption_rate: {
    projections: Array<{
      year: number;
      adoption_percentage: number;
      user_count: number;
    }>;
  };
  hype_cycle: {
    current_phase: string;
    phases: Array<{
      phase: string;
      duration_months: number;
      description: string;
    }>;
  };
}

interface ForecastMetrics {
  totalForecasts: number;
  avgConfidence: number;
  highConfidence: number;
  recentForecasts: number;
}

export default function Forecasting() {
  const [forecasts, setForecasts] = useState<ForecastWithTech[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('5y');
  const [metrics, setMetrics] = useState<ForecastMetrics>({
    totalForecasts: 0,
    avgConfidence: 0,
    highConfidence: 0,
    recentForecasts: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedType, selectedTechnology, selectedTimeframe]);

  const loadData = async () => {
    try {
      const techData = await db.getTechnologies({ orderBy: 'name' });
      setTechnologies(techData);

      // Generate mock forecast data for demonstration
      const mockForecasts = generateMockForecasts(techData);
      setForecasts(mockForecasts);

      // Calculate metrics
      const totalForecasts = mockForecasts.length;
      const avgConfidence = mockForecasts.reduce((sum, f) => sum + (f.confidence_score || 0), 0) / totalForecasts;
      const highConfidence = mockForecasts.filter(f => (f.confidence_score || 0) >= 0.8).length;
      const recentForecasts = mockForecasts.filter(f => {
        const forecastDate = new Date(f.forecast_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return forecastDate >= thirtyDaysAgo;
      }).length;

      setMetrics({
        totalForecasts,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        highConfidence,
        recentForecasts
      });

    } catch (error) {
      console.error('Error loading forecasting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockForecasts = (techs: Technology[]): ForecastWithTech[] => {
    const forecastTypes = ['trl_progression', 'market_size', 'adoption_rate', 'hype_cycle'] as const;
    const models = ['Neural Network', 'ARIMA', 'Exponential Smoothing', 'Monte Carlo', 'Bayesian'];
    
    return techs.slice(0, 8).flatMap(tech => 
      forecastTypes.map((type, index) => ({
        id: `${tech.id}-${type}-${index}`,
        technology_id: tech.id,
        forecast_type: type,
        forecast_data: generateMockForecastData(type),
        forecast_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        time_horizon_years: [3, 5, 7, 10][Math.floor(Math.random() * 4)],
        model_used: models[Math.floor(Math.random() * models.length)],
        confidence_score: 0.6 + Math.random() * 0.4,
        created_at: new Date().toISOString(),
        technology: tech
      }))
    );
  };

  const generateMockForecastData = (type: string): any => {
    const currentYear = new Date().getFullYear();
    
    switch (type) {
      case 'trl_progression':
        return {
          projections: Array.from({ length: 5 }, (_, i) => ({
            year: currentYear + i,
            trl: Math.min(9, 3 + i + Math.random() * 2),
            confidence: 0.7 + Math.random() * 0.3
          }))
        };
      case 'market_size':
        return {
          projections: Array.from({ length: 5 }, (_, i) => ({
            year: currentYear + i,
            market_size_usd: 1000000000 * Math.pow(1.2, i) * (0.8 + Math.random() * 0.4),
            growth_rate: 15 + Math.random() * 10
          }))
        };
      case 'adoption_rate':
        return {
          projections: Array.from({ length: 5 }, (_, i) => ({
            year: currentYear + i,
            adoption_percentage: Math.min(100, 5 + i * 15 + Math.random() * 10),
            user_count: 1000000 * Math.pow(1.5, i)
          }))
        };
      case 'hype_cycle':
        return {
          current_phase: ['Innovation Trigger', 'Peak of Inflated Expectations', 'Trough of Disillusionment', 'Slope of Enlightenment', 'Plateau of Productivity'][Math.floor(Math.random() * 5)],
          phases: [
            { phase: 'Innovation Trigger', duration_months: 6, description: 'Early proof of concept' },
            { phase: 'Peak of Inflated Expectations', duration_months: 12, description: 'Media hype and high expectations' },
            { phase: 'Trough of Disillusionment', duration_months: 18, description: 'Reality sets in, interest wanes' },
            { phase: 'Slope of Enlightenment', duration_months: 24, description: 'Practical applications emerge' },
            { phase: 'Plateau of Productivity', duration_months: 36, description: 'Mainstream adoption' }
          ]
        };
      default:
        return {};
    }
  };

  const handleGenerateForecast = async () => {
    setIsGenerating(true);
    // Simulate AI forecast generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    await loadData();
    setIsGenerating(false);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      trl_progression: Target,
      market_size: TrendingUp,
      adoption_rate: Activity,
      hype_cycle: BarChart3,
    };
    return icons[type] || BarChart3;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      trl_progression: 'bg-slate-100 text-slate-600',
      market_size: 'bg-slate-200 text-slate-700',
      adoption_rate: 'bg-slate-300 text-slate-800',
      hype_cycle: 'bg-slate-200 text-slate-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'bg-slate-100 text-slate-600';
    if (score >= 0.8) return 'bg-slate-300 text-slate-800';
    if (score >= 0.6) return 'bg-slate-200 text-slate-700';
    return 'bg-slate-100 text-slate-600';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const renderForecastChart = (forecast: ForecastWithTech) => {
    const data = forecast.forecast_data as any;
    
    switch (forecast.forecast_type) {
      case 'trl_progression':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">TRL Progression Forecast</h4>
            <div className="space-y-2">
              {data.projections?.map((proj: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{proj.year}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(proj.trl / 9) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8">TRL {proj.trl}</span>
                    <span className="text-xs text-slate-500">({Math.round(proj.confidence * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'market_size':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Market Size Forecast</h4>
            <div className="space-y-2">
              {data.projections?.map((proj: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{proj.year}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(proj.market_size_usd)}</span>
                    <span className="text-xs text-emerald-600">+{proj.growth_rate.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'adoption_rate':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Adoption Rate Forecast</h4>
            <div className="space-y-2">
              {data.projections?.map((proj: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{proj.year}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${proj.adoption_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{proj.adoption_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'hype_cycle':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Hype Cycle Analysis</h4>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Current Phase:</span>
                <span className="text-sm font-bold text-orange-600">{data.current_phase}</span>
              </div>
              <div className="space-y-1">
                {data.phases?.map((phase: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className={`${phase.phase === data.current_phase ? 'font-bold text-orange-600' : 'text-slate-600'}`}>
                      {phase.phase}
                    </span>
                    <span className="text-slate-500">{phase.duration_months}mo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="text-sm text-slate-500">No visualization available</div>;
    }
  };

  const filteredForecasts = forecasts.filter(forecast => {
    const typeMatch = selectedType === 'all' || forecast.forecast_type === selectedType;
    const techMatch = selectedTechnology === 'all' || forecast.technology_id === selectedTechnology;
    return typeMatch && techMatch;
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
          <h1 className="text-2xl font-semibold text-slate-900">Forecasting</h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered predictive analytics</p>
          <p className="text-xs text-slate-400 mt-1">Generate AI-powered forecasts for technology trends, market growth, adoption rates, and TRL progression using advanced machine learning models</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateForecast}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 text-sm"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="font-medium">Generating...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span className="font-medium">Generate Forecasts</span>
              </>
            )}
          </button>
          <button className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+15%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{metrics.totalForecasts}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Forecasts</p>
            <div className="mt-1 text-xs text-slate-400">
              {metrics.recentForecasts} this month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{(metrics.avgConfidence * 100).toFixed(0)}%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Confidence</p>
            <div className="mt-1 text-xs text-slate-400">
              {metrics.highConfidence} high confidence
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <Brain className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">+22%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">5</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">AI Models</p>
            <div className="mt-1 text-xs text-slate-400">
              Neural networks active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <ArrowDown className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500 font-medium">-3%</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">2</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Risk Alerts</p>
            <div className="mt-1 text-xs text-slate-400">
              Requires attention
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Forecast Filters</h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Forecast Types</option>
              <option value="trl_progression">TRL Progression</option>
              <option value="market_size">Market Size</option>
              <option value="adoption_rate">Adoption Rate</option>
              <option value="hype_cycle">Hype Cycle</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-600" />
            <select
              value={selectedTechnology}
              onChange={(e) => setSelectedTechnology(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Technologies</option>
              {technologies.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="1y">1 Year</option>
              <option value="3y">3 Years</option>
              <option value="5y">5 Years</option>
              <option value="10y">10 Years</option>
            </select>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Confidence Threshold:</span>
                <select className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="0.6">60%+</option>
                  <option value="0.7">70%+</option>
                  <option value="0.8">80%+</option>
                  <option value="0.9">90%+</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Model Type:</span>
                <select className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="all">All Models</option>
                  <option value="neural">Neural Network</option>
                  <option value="arima">ARIMA</option>
                  <option value="bayesian">Bayesian</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forecast Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['trl_progression', 'market_size', 'adoption_rate', 'hype_cycle'].map(type => {
          const count = forecasts.filter(f => f.forecast_type === type).length;
          const Icon = getTypeIcon(type);
          const colorClass = getTypeColor(type);
          const isSelected = selectedType === type;
          
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-4 rounded-xl border transition-all ${
                isSelected 
                  ? 'border-cyan-500 bg-cyan-50 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">{count}</p>
                  <p className="text-sm text-slate-600 capitalize">{type.replace('_', ' ')}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Forecasts List */}
      <div className="space-y-4">
        {filteredForecasts.length > 0 ? (
          filteredForecasts.map((forecast) => {
            const Icon = getTypeIcon(forecast.forecast_type);
            return (
              <div
                key={forecast.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(forecast.forecast_type)} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {forecast.technology?.name || 'Unknown Technology'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {forecast.forecast_type.replace('_', ' ').toUpperCase()} • {forecast.technology?.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {forecast.confidence_score !== null && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getConfidenceColor(forecast.confidence_score)}`}>
                        {Math.round((forecast.confidence_score || 0) * 100)}% confidence
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-slate-500 mb-1">Forecast Date</p>
                    <p className="font-medium text-slate-900">{formatDate(forecast.forecast_date)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Time Horizon</p>
                    <p className="font-medium text-slate-900">{forecast.time_horizon_years} years</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Model Used</p>
                    <p className="font-medium text-slate-900">{forecast.model_used || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Current TRL</p>
                    <p className="font-medium text-slate-900">{forecast.technology?.current_trl || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  {renderForecastChart(forecast)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No forecasts match your filters</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your filters or generate new forecasts using AI analysis
            </p>
            <button
              onClick={handleGenerateForecast}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="font-medium">Generating...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">Generate New Forecasts</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}