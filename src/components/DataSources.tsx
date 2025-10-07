import { useEffect, useState } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw, Plus, ChevronDown } from 'lucide-react';
import { db, type DataSource } from '../lib/database';

export default function DataSources() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const data = await db.getDataSources();
      setSources(data);
    } catch (error) {
      console.error('Error loading data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      patent_db: 'bg-slate-100 text-slate-600',
      publication_db: 'bg-slate-200 text-slate-700',
      market_research: 'bg-slate-300 text-slate-800',
      news: 'bg-slate-200 text-slate-700',
      company_db: 'bg-slate-100 text-slate-600',
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  const formatLastSync = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
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
          <h1 className="text-2xl font-semibold text-slate-900">Data Sources</h1>
          <p className="text-slate-500 text-sm mt-1">Manage external data ingestion and synchronization</p>
          <p className="text-xs text-slate-400 mt-1">Configure and monitor data sources from patent databases, publications, market research, and news feeds for automated intelligence gathering</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Source</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{sources.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Sources</p>
            </div>
            <Database className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {sources.filter(s => s.is_active).length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Active Sources</p>
            </div>
            <CheckCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {sources.reduce((sum, s) => sum + s.records_ingested, 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Records Ingested</p>
            </div>
            <Database className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {sources.filter(s => s.last_sync && new Date(s.last_sync).getTime() > Date.now() - 24 * 60 * 60 * 1000).length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Synced Today</p>
            </div>
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {sources.length > 0 ? (
          sources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-slate-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{source.source_name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeColor(source.source_type)} mt-1`}>
                      {source.source_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.is_active ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                  <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                    <RefreshCw className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 mb-0.5">Last Sync</p>
                  <p className="font-medium text-slate-700">{formatLastSync(source.last_sync)}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Sync Frequency</p>
                  <p className="font-medium text-slate-700">Every {source.sync_frequency_hours}h</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Records Ingested</p>
                  <p className="font-medium text-slate-700">{source.records_ingested.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Status</p>
                  <p className="font-medium text-slate-700">
                    {source.is_active ? 'Operational' : 'Paused'}
                  </p>
                </div>
              </div>

              {source.url && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-400 mb-1">Source URL</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-slate-700 break-all"
                  >
                    {source.url}
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">No data sources configured</h3>
            <p className="text-xs text-slate-500 mb-4">
              Start by adding your first data source to begin automated ingestion
            </p>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm">
              Add Data Source
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
