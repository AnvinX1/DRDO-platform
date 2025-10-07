import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Zap, ChevronDown } from 'lucide-react';
import { db, type Technology } from '../lib/database';

export default function Technologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTechnologies();
  }, [statusFilter]);

  const loadTechnologies = async () => {
    try {
      const filters: { status?: string } = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const data = await db.getTechnologies(filters);
      setTechnologies(data);
    } catch (error) {
      console.error('Error loading technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnologies = technologies.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTRLColor = (trl: number | null) => {
    if (!trl) return 'bg-slate-100 text-slate-600';
    if (trl <= 3) return 'bg-slate-200 text-slate-700';
    if (trl <= 6) return 'bg-slate-300 text-slate-800';
    return 'bg-slate-400 text-slate-900';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      emerging: 'bg-slate-100 text-slate-600',
      developing: 'bg-slate-200 text-slate-700',
      mature: 'bg-slate-300 text-slate-800',
      declining: 'bg-slate-100 text-slate-500',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Technologies</h1>
          <p className="text-slate-500 text-sm mt-1">Track and analyze technology development</p>
          <p className="text-xs text-slate-400 mt-1">Monitor technology readiness levels, track development progress, and identify emerging trends across different domains</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Technology</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="emerging">Emerging</option>
            <option value="developing">Developing</option>
            <option value="mature">Mature</option>
            <option value="declining">Declining</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnologies.length > 0 ? (
          filteredTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(tech.status)}`}>
                  {tech.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mb-1">{tech.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {tech.description || 'No description available'}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Domain</span>
                  <span className="font-medium text-slate-700">{tech.domain}</span>
                </div>
                {tech.current_trl && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">TRL</span>
                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getTRLColor(tech.current_trl)}`}>
                      {tech.current_trl}
                    </span>
                  </div>
                )}
                {tech.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tech.keywords.slice(0, 2).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {tech.keywords.length > 2 && (
                      <span className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                        +{tech.keywords.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No technologies found</h3>
              <p className="text-xs text-slate-500 mb-4">
                {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first technology'}
              </p>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm">
                Add Technology
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
