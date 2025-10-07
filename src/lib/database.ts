import type { Database as SupabaseDatabase } from './database.types';

// Type definitions for our local database
export type Technology = SupabaseDatabase['public']['Tables']['technologies']['Row'];
export type Patent = SupabaseDatabase['public']['Tables']['patents']['Row'];
export type Publication = SupabaseDatabase['public']['Tables']['publications']['Row'];
export type Company = SupabaseDatabase['public']['Tables']['companies']['Row'];
export type CompanyTechnology = SupabaseDatabase['public']['Tables']['company_technologies']['Row'];
export type TRLHistory = SupabaseDatabase['public']['Tables']['trl_history']['Row'];
export type MarketData = SupabaseDatabase['public']['Tables']['market_data']['Row'];
export type Forecast = SupabaseDatabase['public']['Tables']['forecasts']['Row'];
export type DataSource = SupabaseDatabase['public']['Tables']['data_sources']['Row'];

class LocalDatabase {
  private storageKey = 'technology_intelligence_db';

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Initialize with empty data if not exists
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        technologies: [],
        patents: [],
        publications: [],
        companies: [],
        company_technologies: [],
        trl_history: [],
        market_data: [],
        forecasts: [],
        data_sources: []
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  private getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  private setData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Technologies methods
  async getTechnologies(filters?: { status?: string; limit?: number; orderBy?: string }) {
    const data = this.getData();
    let technologies = data.technologies || [];
    
    if (filters?.status) {
      technologies = technologies.filter((tech: Technology) => tech.status === filters.status);
    }
    
    if (filters?.orderBy) {
      technologies.sort((a: Technology, b: Technology) => {
        const aVal = a[filters.orderBy as keyof Technology];
        const bVal = b[filters.orderBy as keyof Technology];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return bVal - aVal; // Descending for numbers
        }
        return 0;
      });
    } else {
      technologies.sort((a: Technology, b: Technology) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    
    if (filters?.limit) {
      technologies = technologies.slice(0, filters.limit);
    }
    
    return technologies;
  }

  async getTechnologyCount(filters?: { status?: string }) {
    const data = this.getData();
    let technologies = data.technologies || [];
    
    if (filters?.status) {
      technologies = technologies.filter((tech: Technology) => tech.status === filters.status);
    }
    
    return technologies.length;
  }

  async insertTechnology(technology: Omit<Technology, 'created_at' | 'updated_at'>) {
    const data = this.getData();
    const newTechnology: Technology = {
      ...technology,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    data.technologies = data.technologies || [];
    data.technologies.push(newTechnology);
    this.setData(data);
    
    return { changes: 1 };
  }

  // Patents methods
  async getPatents(filters?: { technology_id?: string; limit?: number; orderBy?: string }) {
    const data = this.getData();
    let patents = data.patents || [];
    
    if (filters?.technology_id) {
      patents = patents.filter((patent: Patent) => patent.technology_id === filters.technology_id);
    }
    
    if (filters?.orderBy) {
      patents.sort((a: Patent, b: Patent) => {
        const aVal = a[filters.orderBy as keyof Patent];
        const bVal = b[filters.orderBy as keyof Patent];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return bVal - aVal;
        }
        return 0;
      });
    } else {
      patents.sort((a: Patent, b: Patent) => 
        new Date(b.filing_date || '').getTime() - new Date(a.filing_date || '').getTime()
      );
    }
    
    if (filters?.limit) {
      patents = patents.slice(0, filters.limit);
    }
    
    return patents;
  }

  async getPatentCount() {
    const data = this.getData();
    return (data.patents || []).length;
  }

  async insertPatents(patents: Omit<Patent, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.patents = data.patents || [];
    
    const newPatents = patents.map(patent => ({
      ...patent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.patents.push(...newPatents);
    this.setData(data);
    
    return { changes: patents.length };
  }

  // Publications methods
  async getPublications(filters?: { technology_id?: string; limit?: number }) {
    const data = this.getData();
    let publications = data.publications || [];
    
    if (filters?.technology_id) {
      publications = publications.filter((pub: Publication) => pub.technology_id === filters.technology_id);
    }
    
    publications.sort((a: Publication, b: Publication) => 
      new Date(b.publication_date || '').getTime() - new Date(a.publication_date || '').getTime()
    );
    
    if (filters?.limit) {
      publications = publications.slice(0, filters.limit);
    }
    
    return publications;
  }

  async getPublicationCount() {
    const data = this.getData();
    return (data.publications || []).length;
  }

  async insertPublications(publications: Omit<Publication, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.publications = data.publications || [];
    
    const newPublications = publications.map(publication => ({
      ...publication,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.publications.push(...newPublications);
    this.setData(data);
    
    return { changes: publications.length };
  }

  // Companies methods
  async getCompanies(filters?: { limit?: number; orderBy?: string }) {
    const data = this.getData();
    let companies = data.companies || [];
    
    if (filters?.orderBy) {
      companies.sort((a: Company, b: Company) => {
        const aVal = a[filters.orderBy as keyof Company];
        const bVal = b[filters.orderBy as keyof Company];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal);
        }
        return 0;
      });
    } else {
      companies.sort((a: Company, b: Company) => a.name.localeCompare(b.name));
    }
    
    if (filters?.limit) {
      companies = companies.slice(0, filters.limit);
    }
    
    return companies;
  }

  async getCompanyCount() {
    const data = this.getData();
    return (data.companies || []).length;
  }

  async insertCompanies(companies: Omit<Company, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.companies = data.companies || [];
    
    const newCompanies = companies.map(company => ({
      ...company,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.companies.push(...newCompanies);
    this.setData(data);
    
    return { changes: companies.length };
  }

  // Company Technologies methods
  async getCompanyTechnologies(filters?: { company_id?: string; technology_id?: string }) {
    const data = this.getData();
    let companyTechnologies = data.company_technologies || [];
    
    if (filters?.company_id) {
      companyTechnologies = companyTechnologies.filter((ct: CompanyTechnology) => ct.company_id === filters.company_id);
    }
    
    if (filters?.technology_id) {
      companyTechnologies = companyTechnologies.filter((ct: CompanyTechnology) => ct.technology_id === filters.technology_id);
    }
    
    return companyTechnologies;
  }

  async insertCompanyTechnologies(companyTechnologies: Omit<CompanyTechnology, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.company_technologies = data.company_technologies || [];
    
    const newCompanyTechnologies = companyTechnologies.map(ct => ({
      ...ct,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.company_technologies.push(...newCompanyTechnologies);
    this.setData(data);
    
    return { changes: companyTechnologies.length };
  }

  // TRL History methods
  async insertTRLHistory(trlHistory: Omit<TRLHistory, 'created_at'>[]) {
    const data = this.getData();
    data.trl_history = data.trl_history || [];
    
    const newTRLHistory = trlHistory.map(trl => ({
      ...trl,
      created_at: new Date().toISOString()
    }));
    
    data.trl_history.push(...newTRLHistory);
    this.setData(data);
    
    return { changes: trlHistory.length };
  }

  // Market Data methods
  async insertMarketData(marketData: Omit<MarketData, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.market_data = data.market_data || [];
    
    const newMarketData = marketData.map(md => ({
      ...md,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.market_data.push(...newMarketData);
    this.setData(data);
    
    return { changes: marketData.length };
  }

  // Forecasts methods
  async insertForecasts(forecasts: Omit<Forecast, 'created_at'>[]) {
    const data = this.getData();
    data.forecasts = data.forecasts || [];
    
    const newForecasts = forecasts.map(forecast => ({
      ...forecast,
      created_at: new Date().toISOString()
    }));
    
    data.forecasts.push(...newForecasts);
    this.setData(data);
    
    return { changes: forecasts.length };
  }

  // Data Sources methods
  async getDataSources() {
    const data = this.getData();
    const dataSources = data.data_sources || [];
    
    return dataSources.sort((a: DataSource, b: DataSource) => a.source_name.localeCompare(b.source_name));
  }

  async insertDataSources(dataSources: Omit<DataSource, 'created_at' | 'updated_at'>[]) {
    const data = this.getData();
    data.data_sources = data.data_sources || [];
    
    const newDataSources = dataSources.map(ds => ({
      ...ds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    data.data_sources.push(...newDataSources);
    this.setData(data);
    
    return { changes: dataSources.length };
  }

  // Close database connection (no-op for localStorage)
  close() {
    // No-op for localStorage
  }
}

// Create and export a singleton instance
export const db = new LocalDatabase();