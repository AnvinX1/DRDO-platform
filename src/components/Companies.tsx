import { useEffect, useState } from 'react';
import { Search, Building2, Globe, Users, TrendingUp, ChevronDown } from 'lucide-react';
import { db, type Company, type CompanyTechnology } from '../lib/database';

interface CompanyWithInvestment extends Company {
  totalInvestment?: number;
  techCount?: number;
}

export default function Companies() {
  const [companies, setCompanies] = useState<CompanyWithInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadCompanies();
  }, [typeFilter]);

  const loadCompanies = async () => {
    try {
      const companiesData = await db.getCompanies();
      
      const companiesWithStats = await Promise.all(
        companiesData.map(async (company) => {
          const investments = await db.getCompanyTechnologies({ company_id: company.id });

          const totalInvestment = investments.reduce(
            (sum, inv) =>
              sum +
              (inv.rd_investment_amount || 0) +
              (inv.government_funding_amount || 0) +
              (inv.private_funding_amount || 0),
            0
          );

          return {
            ...company,
            totalInvestment,
            techCount: investments.length,
          };
        })
      );

      setCompanies(companiesWithStats);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (company.country && company.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      startup: 'bg-slate-100 text-slate-600',
      sme: 'bg-slate-200 text-slate-700',
      large_enterprise: 'bg-slate-300 text-slate-800',
      public_sector: 'bg-slate-200 text-slate-700',
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
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
        <h1 className="text-2xl font-semibold text-slate-900">Companies</h1>
        <p className="text-slate-500 text-sm mt-1">Track companies and R&D investments</p>
        <p className="text-xs text-slate-400 mt-1">Monitor company profiles, track R&D investments, analyze funding patterns, and identify key players in technology sectors</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 text-sm bg-white"
          >
            <option value="all">All Types</option>
            <option value="startup">Startup</option>
            <option value="sme">SME</option>
            <option value="large_enterprise">Large Enterprise</option>
            <option value="public_sector">Public Sector</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{companies.length}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {companies.filter(c => c.company_type === 'startup').length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Startups</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {companies.filter(c => c.company_type === 'large_enterprise').length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Enterprises</p>
            </div>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {new Set(companies.map(c => c.country).filter(Boolean)).size}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Countries</p>
            </div>
            <Globe className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(company.company_type)}`}>
                  {company.company_type.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mb-1">{company.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {company.description || 'No description available'}
              </p>

              <div className="space-y-2">
                {company.country && (
                  <div className="flex items-center gap-2 text-xs">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-500">{company.country}</span>
                  </div>
                )}
                {company.employee_count && (
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-500">{company.employee_count.toLocaleString()} employees</span>
                  </div>
                )}
                {company.founded_year && (
                  <div className="text-xs text-slate-500">
                    Founded: {company.founded_year}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5">Technologies</p>
                    <p className="font-semibold text-slate-700">{company.techCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">Investment</p>
                    <p className="font-semibold text-slate-700">
                      {company.totalInvestment ? formatCurrency(company.totalInvestment) : '$0'}
                    </p>
                  </div>
                </div>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  <Globe className="w-3 h-3" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No companies found</h3>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Try adjusting your search criteria' : 'No company data available yet'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
