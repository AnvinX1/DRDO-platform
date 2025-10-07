export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      technologies: {
        Row: {
          id: string
          name: string
          description: string | null
          domain: string
          subdomain: string | null
          current_trl: number | null
          keywords: string[]
          status: 'emerging' | 'developing' | 'mature' | 'declining'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          domain: string
          subdomain?: string | null
          current_trl?: number | null
          keywords?: string[]
          status?: 'emerging' | 'developing' | 'mature' | 'declining'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          domain?: string
          subdomain?: string | null
          current_trl?: number | null
          keywords?: string[]
          status?: 'emerging' | 'developing' | 'mature' | 'declining'
          created_at?: string
          updated_at?: string
        }
      }
      patents: {
        Row: {
          id: string
          technology_id: string | null
          patent_number: string
          title: string
          abstract: string | null
          filing_date: string | null
          publication_date: string | null
          grant_date: string | null
          country_code: string
          assignee: string | null
          inventors: string[]
          classification_codes: string[]
          citation_count: number
          legal_status: string
          url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          patent_number: string
          title: string
          abstract?: string | null
          filing_date?: string | null
          publication_date?: string | null
          grant_date?: string | null
          country_code: string
          assignee?: string | null
          inventors?: string[]
          classification_codes?: string[]
          citation_count?: number
          legal_status?: string
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          patent_number?: string
          title?: string
          abstract?: string | null
          filing_date?: string | null
          publication_date?: string | null
          grant_date?: string | null
          country_code?: string
          assignee?: string | null
          inventors?: string[]
          classification_codes?: string[]
          citation_count?: number
          legal_status?: string
          url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          technology_id: string | null
          title: string
          abstract: string | null
          authors: string[]
          publication_date: string | null
          source: string | null
          doi: string | null
          citation_count: number
          keywords: string[]
          url: string | null
          relevance_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          title: string
          abstract?: string | null
          authors?: string[]
          publication_date?: string | null
          source?: string | null
          doi?: string | null
          citation_count?: number
          keywords?: string[]
          url?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          title?: string
          abstract?: string | null
          authors?: string[]
          publication_date?: string | null
          source?: string | null
          doi?: string | null
          citation_count?: number
          keywords?: string[]
          url?: string | null
          relevance_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          country: string | null
          founded_year: number | null
          employee_count: number | null
          company_type: 'startup' | 'sme' | 'large_enterprise' | 'public_sector'
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          country?: string | null
          founded_year?: number | null
          employee_count?: number | null
          company_type?: 'startup' | 'sme' | 'large_enterprise' | 'public_sector'
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          country?: string | null
          founded_year?: number | null
          employee_count?: number | null
          company_type?: 'startup' | 'sme' | 'large_enterprise' | 'public_sector'
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      company_technologies: {
        Row: {
          id: string
          company_id: string | null
          technology_id: string | null
          involvement_type: 'developing' | 'researching' | 'commercializing'
          rd_investment_amount: number
          government_funding_amount: number
          private_funding_amount: number
          investment_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          technology_id?: string | null
          involvement_type?: 'developing' | 'researching' | 'commercializing'
          rd_investment_amount?: number
          government_funding_amount?: number
          private_funding_amount?: number
          investment_year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          technology_id?: string | null
          involvement_type?: 'developing' | 'researching' | 'commercializing'
          rd_investment_amount?: number
          government_funding_amount?: number
          private_funding_amount?: number
          investment_year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      trl_history: {
        Row: {
          id: string
          technology_id: string | null
          trl_level: number
          assessment_date: string
          evidence: string | null
          assessed_by: string | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          trl_level: number
          assessment_date: string
          evidence?: string | null
          assessed_by?: string | null
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          trl_level?: number
          assessment_date?: string
          evidence?: string | null
          assessed_by?: string | null
          confidence_score?: number | null
          created_at?: string
        }
      }
      market_data: {
        Row: {
          id: string
          technology_id: string | null
          year: number
          market_size_usd: number
          growth_rate_percent: number | null
          data_source: string | null
          is_forecast: boolean
          confidence_level: 'high' | 'medium' | 'low'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          year: number
          market_size_usd?: number
          growth_rate_percent?: number | null
          data_source?: string | null
          is_forecast?: boolean
          confidence_level?: 'high' | 'medium' | 'low'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          year?: number
          market_size_usd?: number
          growth_rate_percent?: number | null
          data_source?: string | null
          is_forecast?: boolean
          confidence_level?: 'high' | 'medium' | 'low'
          created_at?: string
          updated_at?: string
        }
      }
      technology_convergence: {
        Row: {
          id: string
          technology_a_id: string | null
          technology_b_id: string | null
          convergence_type: 'integration' | 'complementary' | 'substitution'
          strength_score: number | null
          evidence: string | null
          detection_date: string
          created_at: string
        }
        Insert: {
          id?: string
          technology_a_id?: string | null
          technology_b_id?: string | null
          convergence_type?: 'integration' | 'complementary' | 'substitution'
          strength_score?: number | null
          evidence?: string | null
          detection_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          technology_a_id?: string | null
          technology_b_id?: string | null
          convergence_type?: 'integration' | 'complementary' | 'substitution'
          strength_score?: number | null
          evidence?: string | null
          detection_date?: string
          created_at?: string
        }
      }
      forecasts: {
        Row: {
          id: string
          technology_id: string | null
          forecast_type: 'trl_progression' | 'market_size' | 'adoption_rate' | 'hype_cycle'
          forecast_data: Json
          forecast_date: string
          time_horizon_years: number
          model_used: string | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          forecast_type: 'trl_progression' | 'market_size' | 'adoption_rate' | 'hype_cycle'
          forecast_data: Json
          forecast_date?: string
          time_horizon_years?: number
          model_used?: string | null
          confidence_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          forecast_type?: 'trl_progression' | 'market_size' | 'adoption_rate' | 'hype_cycle'
          forecast_data?: Json
          forecast_date?: string
          time_horizon_years?: number
          model_used?: string | null
          confidence_score?: number | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string | null
          technology_id: string | null
          alert_type: 'new_patent' | 'trl_change' | 'market_shift' | 'convergence_detected' | 'publication_spike'
          conditions: Json | null
          is_active: boolean
          last_triggered: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          technology_id?: string | null
          alert_type: 'new_patent' | 'trl_change' | 'market_shift' | 'convergence_detected' | 'publication_spike'
          conditions?: Json | null
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          technology_id?: string | null
          alert_type?: 'new_patent' | 'trl_change' | 'market_shift' | 'convergence_detected' | 'publication_spike'
          conditions?: Json | null
          is_active?: boolean
          last_triggered?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      data_sources: {
        Row: {
          id: string
          source_name: string
          source_type: 'patent_db' | 'publication_db' | 'market_research' | 'news' | 'company_db'
          url: string | null
          last_sync: string | null
          sync_frequency_hours: number
          is_active: boolean
          records_ingested: number
          configuration: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_name: string
          source_type: 'patent_db' | 'publication_db' | 'market_research' | 'news' | 'company_db'
          url?: string | null
          last_sync?: string | null
          sync_frequency_hours?: number
          is_active?: boolean
          records_ingested?: number
          configuration?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_name?: string
          source_type?: 'patent_db' | 'publication_db' | 'market_research' | 'news' | 'company_db'
          url?: string | null
          last_sync?: string | null
          sync_frequency_hours?: number
          is_active?: boolean
          records_ingested?: number
          configuration?: Json
          created_at?: string
          updated_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          technology_id: string | null
          analysis_type: 'sentiment' | 'trend' | 'competitive' | 'signal' | 'summary'
          results: Json
          analyzed_at: string
          valid_until: string | null
          created_at: string
        }
        Insert: {
          id?: string
          technology_id?: string | null
          analysis_type: 'sentiment' | 'trend' | 'competitive' | 'signal' | 'summary'
          results: Json
          analyzed_at?: string
          valid_until?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          technology_id?: string | null
          analysis_type?: 'sentiment' | 'trend' | 'competitive' | 'signal' | 'summary'
          results?: Json
          analyzed_at?: string
          valid_until?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
