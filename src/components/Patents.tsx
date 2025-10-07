import { useEffect, useState } from 'react';
import { Search, FileText, ExternalLink, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { db, type Patent } from '../lib/database';

export default function Patents() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  useEffect(() => {
    loadPatents();
  }, [countryFilter]);

  const loadPatents = async () => {
    try {
      const data = await db.getPatents();
      setPatents(data);
    } catch (error) {
      console.error('Error loading patents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatents = patents.filter((patent) =>
    patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patent.patent_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patent.assignee && patent.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const uniqueCountries = Array.from(new Set(patents.map(p => p.country_code))).sort();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Patents</h1>
        <p className="text-slate-500 text-sm mt-1">Global patent tracking and analysis</p>
        <p className="text-xs text-slate-400 mt-1">Search and analyze patent databases worldwide, track intellectual property trends, and monitor competitive landscapes</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patents by title, number, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
            />
          </div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
          >
            <option value="all">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{patents.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
            </div>
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{uniqueCountries.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Countries</p>
            </div>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {patents.filter(p => p.legal_status === 'granted').length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Granted</p>
            </div>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredPatents.length > 0 ? (
          filteredPatents.map((patent) => (
            <div
              key={patent.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{patent.title}</h3>
                    {patent.url && (
                      <a
                        href={patent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {patent.abstract && (
                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">{patent.abstract}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 mb-0.5">Number</p>
                  <p className="font-medium text-slate-700">{patent.patent_number}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Country</p>
                  <p className="font-medium text-slate-700">{patent.country_code}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Filing Date</p>
                  <p className="font-medium text-slate-700">{formatDate(patent.filing_date)}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-0.5">Status</p>
                  <span
                    className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
                      patent.legal_status === 'granted'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {patent.legal_status}
                  </span>
                </div>
              </div>

              {patent.assignee && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Assignee</p>
                      <p className="text-xs font-medium text-slate-700">{patent.assignee}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {patent.citation_count > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Citations</p>
                          <p className="text-xs font-medium text-slate-700">{patent.citation_count}</p>
                        </div>
                      )}
                      {patent.inventors.length > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Inventors</p>
                          <p className="text-xs font-medium text-slate-700">{patent.inventors.length}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">No patents found</h3>
            <p className="text-xs text-slate-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'No patent data available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
